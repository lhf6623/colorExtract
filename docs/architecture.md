# 技术架构

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 |
| 桌面容器 | Tauri 2 |
| 构建 | Vite 8 |
| CSS 方案 | UnoCSS 66 |
| 图标 | @iconify-json/fluent, @iconify-json/ph |
| 语言 | TypeScript 6 |
| JS 扩展 | JSX (vue-jsx) |

---

## 项目结构

```
colorExtract/
├── src/
│   ├── App.vue              # 主界面布局
│   ├── main.ts              # 入口，挂载 UnoCSS
│   ├── color.ts             # 颜色计算核心（插值、转换、搜索）
│   ├── common.tsx           # 通用组件（Grids, ColorGradient, CopyColor）
│   ├── ColorExtract.vue     # 颜色选择器主组件
│   ├── ColorInput.vue       # RGBA 输入框组件
│   ├── ColorDropper.vue     # 屏幕取色器组件
│   ├── MoveArea.vue         # 可拖动区域组件
│   ├── utils.ts             # 工具函数（roundTo, getRange）
│   └── types.d.ts           # 类型声明（EyeDropper, UnoCSS attributify）
├── src-tauri/               # Rust 后端
├── public/                  # 静态资源
├── docs/                    # 项目文档
├── uno.config.ts            # UnoCSS 配置
├── vite.config.ts           # Vite 配置
└── package.json
```
