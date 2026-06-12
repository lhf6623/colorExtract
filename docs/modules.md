# 模块说明

| 文件 | 职责 |
|------|------|
| `color.ts` | 颜色计算核心：渐变生成、双线性插值、RGB↔Hex 转换、反向位置搜索 |
| `common.tsx` | 通用 UI 组件：棋盘格背景（Grids）、颜色渐变条（ColorGradient）、颜色复制按钮（CopyColor） |
| `ColorExtract.vue` | 颜色选择器主组件：整合色板、彩虹条、输入框、取色器 |
| `ColorInput.vue` | RGBA 数值输入框，支持手动修改颜色分量 |
| `ColorDropper.vue` | 屏幕取色器，封装 EyeDropper API |
| `MoveArea.vue` | 通用可拖动区域，封装鼠标事件和坐标计算 |
| `utils.ts` | 工具函数（roundTo, getRange） |
| `types.d.ts` | TypeScript 类型声明（EyeDropper API, UnoCSS attributify） |
