import { describe, it, expect } from 'bun:test';
import { addMemory, getMemories, isMemoryCommand, isSearchRequest } from '../scripts/memory';
import { searchMemories } from '../scripts/search';
import { assembleContext } from '../scripts/assemble';

describe('Memory Manager', () => {
  it('应该识别记忆指令', () => {
    const result1 = isMemoryCommand('记住：项目使用 Bun');
    expect(result1.isCommand).toBe(true);
    expect(result1.content).toBe('项目使用 Bun');

    const result2 = isMemoryCommand('普通对话');
    expect(result2.isCommand).toBe(false);
  });

  it('应该识别搜索请求', () => {
    expect(isSearchRequest('之前说过什么')).toBe(true);
    expect(isSearchRequest('还记得数据库配置吗')).toBe(true);
    expect(isSearchRequest('普通问题')).toBe(false);
  });

  it('应该添加和获取记忆', () => {
    addMemory('测试用户画像内容', 'user_profile');
    addMemory('测试项目记忆内容', 'project');

    const profiles = getMemories('user_profile');
    expect(profiles.length).toBeGreaterThan(0);

    const memories = getMemories('project');
    expect(memories.length).toBeGreaterThan(0);
  });

  it('应该搜索记忆', () => {
    addMemory('使用 React Hooks 管理状态', 'project');
    addMemory('项目使用 TypeScript', 'project');
    const results = searchMemories('React', 3);
    expect(results.length).toBeGreaterThan(0);
  });

  it('应该组装上下文', () => {
    const context = assembleContext('怎么运行项目', 500);
    expect(typeof context).toBe('string');
  });
});
