# 数据流

## 正向：位置 → 颜色（O(1)）

```
彩虹条拖动 → gradientColors[] 查出 rightTopColor
色板拖动 → 坐标 (x, y) → 归一化 (u, v)
         → getSelectColor(x, y, rightTopColor)
         → bilinearInterpolationRGB()
         → RGB → rgbToHex() → #rrggbb 显示
```

用户拖动色板或彩虹条时，实时计算当前位置对应的颜色并展示。

---

## 反向：颜色 → 位置

```
EyeDropper.open() → 屏幕 #hex
                 → hexToRgba() → RGB
                 → findPositionForColor()
                 → 返回 { x, y, rightTopIndex, rightTopColor }
```

反向流程已用 HSV 反算替代暴力搜索，O(1) 复杂度：

```
EyeDropper.open() → 屏幕 #hex
                 → hexToRgba() → RGB
                 → rgbToHsv() → H, S, V
                 → H → rightTopIndex → gradientColors[] 查 rightTopColor
                 → S → x, V → y（色板坐标）
                 → 返回 { x, y, rightTopIndex, rightTopColor }
```

详见 [HSV 模型与坐标反算](hsv-model)。
