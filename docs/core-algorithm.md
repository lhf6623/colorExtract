# 核心算法：双线性插值

## 色板结构

色板是一个矩形区域，四个角颜色定义如下：

```
左上 (x1)                右上 (y1)
  white [255,255,255]      pure hue (来自彩虹条)

左下 (x2)                右下 (y2)
  black [0,0,0]            black [0,0,0]
```

- **水平方向**：白色（左）→ 纯色（右），控制饱和度
- **垂直方向**：亮色（上）→ 黑色（下），控制明度

---

## 插值步骤

给定色板坐标 (x, y)，归一化为 u = x/width, v = y/height（0~1）：

1. **上边插值**：`top = (1-u) * x1 + u * y1`
2. **下边插值**：`bottom = (1-u) * x2 + u * y2`（因 x2=y2=黑，bottom 恒为 [0,0,0]）
3. **垂直插值**：`P = (1-v) * top + v * bottom`

展开形式：

```
P = (1-u)(1-v) * x1 + u(1-v) * y1 + (1-u)v * x2 + uv * y2
```

对 R、G、B 三个通道分别独立计算，结果取整即为像素颜色。

---

## 彩虹条

彩虹条由 7 个关键色通过线性插值生成 `gradientColors[]`：

```
red → magenta → blue → cyan → lime → yellow → red
```

每个相邻色对按 `GRADIENT_SEGMENTS = SELECT_HEIGHT / 6` 步长插值。用户拖动彩虹条时，从数组中取出对应颜色作为色板右上角 `rightTopColor`。

---

## 反向：颜色 → 位置

v0.2.0 起改用 HSV 反算（O(1)）。RGB 先转为 HSV，再由 H/S/V 分量映射回色板坐标：

```
RGB → rgbToHsv(r,g,b) → [H, S, V]
  H → rightTopIndex = H / 360 * gradientColors.length
  S → x = S * SELECT_WIDTH
  V → y = (1 - V) * SELECT_HEIGHT
```

详见 [HSV 模型与坐标反算](hsv-model)。
