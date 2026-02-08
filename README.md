# OpenCode Memory Manager

基于 Jeff Huber Context Engineering 理论的 OpenCode 记忆管理技能。

## 功能特点

- **自动捕获**: 检测 "记住..." 指令自动保存
- **语义搜索**: 关键词匹配 + 相似度排序
- **上下文组装**: 自动注入相关记忆到对话
- **跨会话持久化**: SQLite 数据库存储
- **用户画像**: 跨项目共享用户偏好
- **项目记忆**: 当前项目专属知识

## 安装

### 方法 1: 直接克隆到 skills 目录

```bash
cd ~/.opencode/skills
git clone https://github.com/jinxumi/opencode-memory-manager.git memory-manager
cd memory-manager
bun install
```

### 方法 2: 手动下载

1. 下载本仓库代码
2. 解压到 `~/.opencode/skills/memory-manager/`
3. 运行 `bun install`

## 使用

在 AGENTS.md 中添加：

```markdown
## 记忆系统（自动）

本项目使用 memory-manager 技能自动管理记忆。

### 自动触发
- 说 "记住..." 自动保存到项目记忆
- 询问历史信息自动搜索并注入

### 使用示例
用户：记住，项目使用 Bun 运行时
[系统自动保存]

用户：怎么运行测试？
[系统自动注入："项目使用 Bun"]
AI：使用 `bun test` 运行测试...
```

## 技术架构

```
Gather → Glean → Assembly
(收集)  → (筛选) → (组装)
```

基于 Jeff Huber 的 Context Engineering 三阶段模型：
1. **Gather**: 从 SQLite 收集所有记忆
2. **Glean**: 关键词匹配 + 相似度排序
3. **Assembly**: Token 预算管理，优先级注入

## 文件结构

```
memory-manager/
├── SKILL.md              # 技能定义
├── package.json          # 依赖配置
├── README.md            # 本文件
├── scripts/
│   ├── memory.ts        # 核心存储（SQLite）
│   ├── search.ts        # 语义搜索
│   └── assemble.ts      # 上下文组装
└── test/
    └── basic.test.ts    # 测试脚本
```

## 测试

```bash
bun test
```

## 配置

记忆数据库存储位置：
- 路径: `~/.opencode-mem/memory.db`
- 格式: SQLite

## 依赖

- [Bun](https://bun.sh/) - JavaScript 运行时
- @xenova/transformers - 嵌入模型（可选，用于高级语义搜索）

## 许可证

MIT

## 作者

jinxumi

## 参考

- [Jeff Huber - The Rise of Context Engineering](https://jeffhuber.substack.com/p/the-rise-of-context-engineering)
- [OpenCode Documentation](https://opencode.ai/docs)
