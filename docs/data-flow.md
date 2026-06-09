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

当前反向流程为暴力搜索（遍历所有可能的坐标组合），需优化为 HSV 反算。

参见 [HSV 模型与坐标反算](hsv-model) 中的反算方案。
