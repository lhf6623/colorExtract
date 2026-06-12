# 问题清单

> 审查日期：2026-06-09 · 修复日期：2026-06-12

---

## 🔴 P1 — Bug / 逻辑错误

| # | 问题 | 文件 | 说明 | 状态 |
|---|------|------|------|------|
| 1 | `findPositionForColor` 递归性能炸弹 | `color.ts:159` | 最坏 20 亿次插值计算，会卡死界面。应改用 HSV 反算 | ✅ 已修复 |
| 2 | rgba 输入节流逻辑方向反了 | `ColorInput.vue:92` | 当前"每 1 秒才 emit 一次"，应改为 debounce | ✅ 已修复 |
| 3 | `EyeDropper` 类型声明自相矛盾 | `html.d.ts:9` | 构造签名写在 interface 里，TS 无法正确推导 | ✅ 已修复 |

---

## 🟡 P2 — 设计缺陷

| # | 问题 | 文件 | 说明 | 状态 |
|---|------|------|------|------|
| 4 | `getSelectColor` 四角特判无意义 | `color.ts:118` | 数学上与 bilinearInterpolationRGB 完全等价 | ✅ 已修复 |
| 5 | `interpolateColor` 中 `getInt` 无意义 | `color.ts:96` | 只是 Math.round 的别名 | ✅ 已修复 |
| 6 | `ColorGradient` 不是响应式组件 | `common.tsx:36` | 普通函数，props 变化不触发重渲染 | ✅ 已修复 |
| 7 | `SELECT_WIDTH/HEIGHT` 硬编码需手动同步 | `color.ts:4` | 与样式中的 w-232px 必须手动保持一致 | ✅ 已修复 |
| 8 | `MoveArea` 双重 resize 监听 | `MoveArea.vue:105` | ResizeObserver 已够，window.resize 冗余 | ✅ 已修复 |

---

## ⚪ P3 — 代码质量

| # | 问题 | 文件 | 说明 | 状态 |
|---|------|------|------|------|
| 9 | `Math.round(...) | 0` 多余 | `ColorExtract.vue:126` | Math.round 已返回整数，按位或无意义 | ✅ 已修复 |
| 10 | `ColorDropper` Escape 假关闭 | `ColorDropper.vue:44` | 只改样式，应用 AbortSignal 真正取消取色器 | ✅ 已修复 |

---

## 修复摘要

| 提交 | 内容 |
|------|------|
| `1fda803` | #2 debounce 修复、MoveArea watch immediate |
| `afb5546` | #1 HSV 反算、#3 类型分离、#4~#10 其余 8 项 |
