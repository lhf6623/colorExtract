# HSV 色彩模型与坐标反算

## HSV 模型

- **H（Hue，色相）**：0°~360°，色轮位置。0°=红，120°=绿，240°=蓝
- **S（Saturation，饱和度）**：0~1，颜色纯度。S=0 灰白，S=1 最纯
- **V（Value，明度）**：0~1，颜色亮度。V=0 纯黑，V=1 最亮

---

## HSV 与色板的映射

| HSV 分量 | 映射到 | 计算方式 |
|----------|--------|---------|
| H（色相） | 彩虹条索引 | `H / 360 * (gradientColors.length - 1)` |
| S（饱和度） | 色板 x 坐标 | `S * SELECT_WIDTH` |
| V（明度） | 色板 y 坐标 | `(1 - V) * SELECT_HEIGHT` |

---

## RGB 转 HSV 算法

```
1. r /= 255, g /= 255, b /= 255
2. cMax = max(r, g, b), cMin = min(r, g, b), delta = cMax - cMin
3. H: delta==0 → 0; cMax==r → 60*((g-b)/delta%6); cMax==g → 60*((b-r)/delta+2); else → 60*((r-g)/delta+4)
4. H < 0 → H += 360
5. S = cMax==0 ? 0 : delta / cMax
6. V = cMax
```

### TypeScript 实现

```ts
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const cMax = Math.max(r, g, b);
  const cMin = Math.min(r, g, b);
  const delta = cMax - cMin;

  let h = 0;
  if (delta !== 0) {
    if (cMax === r)      h = 60 * (((g - b) / delta) % 6);
    else if (cMax === g) h = 60 * ((b - r) / delta + 2);
    else                 h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;

  const s = cMax === 0 ? 0 : delta / cMax;
  const v = cMax;
  return [h, s, v];
}
```

---

## HSV 反算实现（v0.2.0 已采用）

`findPositionForColor` 已从暴力搜索改为 HSV 反算，O(1) 复杂度：

```ts
export function findPositionForColor(targetColor: number[]) {
  const [r, g, b] = targetColor;
  const [h, s, v] = rgbToHsv(r, g, b);
  const rightTopIndex = Math.round(h / 360 * (gradientColors.length - 1));
  const x = s * SELECT_WIDTH;
  const y = (1 - v) * SELECT_HEIGHT;
  const rightTopColor = gradientColors[rightTopIndex];
  return { x, y, rightTopIndex, rightTopColor };
}
```

**精度说明**：RGB 线性插值与 HSV 插值在高饱和度区域有约 2~3 像素差异（走"弦"而非"弧线"），肉眼不可辨。
