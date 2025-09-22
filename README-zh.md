# MemU 与 SillyTavern 集成说明

本仓库打包了连接 SillyTavern 与 MemU 记忆服务所需的两个组件：

- `memu-sillytavern-extension/`：运行在浏览器端的 React 扩展，负责 UI、配置，以及决定何时把对话发送给 MemU。
- `memu-sillytavern-plugin/`：运行在 SillyTavern 服务器端的 Express 插件，负责把扩展发来的请求转发给 `memu-js`（MemU 官方 SDK）。

```
SillyTavern UI ── MemU 扩展 ── SillyTavern 插件 ── MemU 云服务
     ▲              ▲            ▲                    ▲
     │ 监听聊天事件  │            │                    │
     │ 准备提示词    │            │ /api/plugins/memu  │
     └──────── 插入总结     ──────┴─────  网络代理 ─────┘
```

## 核心功能

- **总结节奏可配置**：`First summary floor` 决定新聊天积累多少条消息后才首次提交；`Summary interval` 控制后续每隔多少条消息再次触发。
- **手动触发**：点击 “Summarize now” 按钮会立即提交当前对话并重置计数器。
- **提示词注入**：从 MemU 拉回的分类摘要会替换或追加到 SillyTavern 的系统摘要位置（取决于是否勾选 “Override Summarizer”）。
- **后台轮询**：定时器追踪任务状态，失败时自动重试；任务成功后拉取分类记忆写入本地缓存。
- **聊天级状态**：API Key 和节奏设置保存在 `localStorage`；聊天元数据保存在 `chatMetadata.memuExtras`，不同角色互不干扰。

## 安装步骤

1. 将 `memu-sillytavern-extension/` 复制到 SillyTavern 安装目录的 `public/scripts/extensions/third-party/`，在该目录执行 `npm install && npm run build`。
2. 将 `memu-sillytavern-plugin/` 复制到 `server/plugins/third-party/`（或 `server/plugins/memu/`），同样执行 `npm install && npm run build`，并重启 SillyTavern。
3. 在 SillyTavern 的扩展/插件管理界面开启 MemU 扩展与插件，输入 MemU API Key，按需调整总结楼层参数。
4. 调试时可在浏览器控制台查看 `memu-ext:` 输出，在服务器终端查看 `[Memu-SillyTavern-Plugin]` 日志。

## 开发提示

- `prepareConversationData()` 会把 `st.getContext().chat` 转成 MemU 需要的角色/姓名结构；若需过滤 UI 标记，可在此函数中先做清洗。
- Express 插件暴露 `/getTaskStatus`、`/getTaskSummaryReady`、`/retrieveDefaultCategories`、`/memorizeConversation` 四条路由，直接复用 `memu-js` 的 `MemuClient`。
- 两个子项目都采用 TypeScript + webpack 构建；若在 Windows 上遇到缺少类型定义的报错，需要安装 `@types/express`、`@types/body-parser`。

## 已知问题与改进方向

- **消息清洗**：当前会直接把完整聊天记录发给 MemU，可能包含前端装饰性标签；建议按需添加过滤逻辑。
- **状态反馈不足**：失败信息仅在控制台可见，可考虑在设置面板增加任务状态显示。
- **错误提示**：后端返回的错误没有显式显示给用户（例如 API Key 失效），后续可补充 UI 提示。
- **构建依赖路径**：webpack 解析 `@silly-tavern/*` 依赖时需要置于真实的 SillyTavern 树中，若想单独构建需调整别名。

欢迎基于此仓库继续扩展 MemU 的功能，例如增加更多 MemU API 的调用、或在 UI 中展示记忆内容。
