# colorExtract

> 版本 0.1.3 · 桌面颜色选择器

---

## 简介

colorExtract 是一个基于 Tauri + Vue 3 的桌面颜色选择器应用，支持：

- 色板拖拽选色（饱和度 + 明度）
- 彩虹条选择色相
- 屏幕吸管取色（EyeDropper API）
- 颜色值复制（Hex / RGBA）
- 深色模式

核心算法为**双线性插值**，在四个角颜色之间做平滑过渡来计算任意位置的像素颜色。

---

## 文档导航

| 文档 | 内容 |
|------|------|
| [技术架构](architecture) | 技术栈与项目结构 |
| [核心算法](core-algorithm) | 双线性插值原理 |
| [HSV 模型与坐标反算](hsv-model) | HSV 色彩模型与坐标反算 |
| [数据流](data-flow) | 正向/反向数据流 |
| [模块说明](modules) | 各模块职责说明 |
| [问题清单](issues) | 已知问题清单 |

---

## 本地开发

```bash
pnpm install
pnpm tauri dev
```

## 构建

```bash
pnpm tauri build
```
