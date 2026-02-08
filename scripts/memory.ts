import { Database } from 'bun:sqlite';
import { join } from 'path';
import { homedir } from 'os';
import { mkdirSync, existsSync } from 'fs';

const DB_DIR = join(homedir(), '.opencode-mem');
const DB_PATH = join(DB_DIR, 'memory.db');

// 确保目录存在（使用 Node.js fs）
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.run(`
  CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    project_path TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )
`);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 添加记忆
export function addMemory(content: string, type: 'user_profile' | 'project' | 'session', projectPath?: string): void {
  const id = generateId();
  const now = Date.now();
  db.run(
    `INSERT INTO memories (id, content, type, project_path, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, content, type, projectPath || process.cwd(), now, now]
  );
  console.log(`[Memory] 已保存: ${content.slice(0, 50)}...`);
}

// 获取记忆
export function getMemories(type?: string, limit: number = 10): Array<{content: string}> {
  if (type) {
    return db.query(`SELECT content FROM memories WHERE type = ? ORDER BY updated_at DESC LIMIT ?`)
      .all(type, limit) as Array<{content: string}>;
  }
  return db.query(`SELECT content FROM memories ORDER BY updated_at DESC LIMIT ?`)
    .all(limit) as Array<{content: string}>;
}

// 检查记忆指令
export function isMemoryCommand(text: string): {isCommand: boolean, content?: string} {
  const patterns = [
    /记住[：:,]?\s*(.+)/i,
    /别忘了[：:,]?\s*(.+)/i,
    /注意[：:,]?\s*(.+)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return { isCommand: true, content: match[1].trim() };
  }
  return { isCommand: false };
}

// 检查搜索请求
export function isSearchRequest(text: string): boolean {
  return /(之前说过|还记得|以前提到|查找.*记忆)/i.test(text);
}
