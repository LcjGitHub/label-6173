# 露营装备重量管理系统

一个基于 React + TypeScript + Vite 的露营装备重量管理应用，帮助用户规划和管理露营装备的重量与预算。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **UI 组件库**: Blueprint.js
- **状态管理**: Zustand
- **路由**: React Router
- **拖拽**: @hello-pangea/dnd
- **代码规范**: ESLint + Prettier

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

启动后访问 http://localhost:8101

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 代码检查与格式化

### 类型检查

```bash
npm run typecheck
```

运行 TypeScript 类型检查，不生成输出文件。

### ESLint 检查

```bash
npm run lint
```

运行 ESLint 代码规范检查，包含 TypeScript、React 和 Prettier 规则。

### 自动修复 ESLint 问题

```bash
npm run lint:fix
```

自动修复 ESLint 可修复的问题。

### 代码格式化

```bash
npm run format
```

使用 Prettier 格式化所有源代码文件。

### 格式化检查

```bash
npm run format:check
```

检查代码是否符合 Prettier 格式规范，不修改文件。

### 完整检查（推荐在提交前运行）

```bash
npm run ci-check
```

依次执行类型检查、ESLint 检查和格式化检查，确保代码符合所有规范。

## 持续集成 (CI)

项目配置了 GitHub Actions 持续集成工作流，在以下情况自动执行：

- 代码推送到 `main` 或 `master` 分支时
- 向 `main` 或 `master` 分支提交合并请求时

### CI 执行步骤

1. 检出代码
2. 设置 Node.js 环境
3. 安装依赖 (`npm ci`)
4. 类型检查
5. ESLint 代码规范检查
6. Prettier 格式检查
7. 生产构建

### 构建失败处理

如果 CI 执行失败：

- 在合并请求中会显示明确的失败状态标识
- 可点击 **Details** 查看具体失败原因
- 修复问题后重新推送代码即可重新触发 CI 检查

建议在本地提交代码前先运行 `npm run ci-check`，确保所有检查通过。

## 项目结构

```
src/
├── components/     # 通用组件
├── pages/          # 页面组件
├── hooks/          # 自定义 Hooks
├── store/          # Zustand 状态管理
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── mock/           # 模拟数据
├── styles/         # 全局样式
├── App.tsx         # 应用根组件
└── main.tsx        # 应用入口
```
