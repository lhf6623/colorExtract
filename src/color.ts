import { roundTo, getRange } from "./utils";

// 色板尺寸常量
export const SELECT_WIDTH = 232;
export const SELECT_HEIGHT = 128;
export const BAR_WIDTH = 130;
export const GRADIENT_SEGMENTS = SELECT_HEIGHT / 6;
// 将颜色名转换为 RGB
function colorNameToRGB(color: string) {
  const colors = {
    white: [255, 255, 255],
    black: [0, 0, 0],
    red: [255, 0, 0],
    magenta: [255, 0, 255],
    blue: [0, 0, 255],
    cyan: [0, 255, 255],
    lime: [0, 255, 0],
    yellow: [255, 255, 0],
  };
  return colors[color as keyof typeof colors] || [0, 0, 0];
}
// 生成右上角的渐变色
function generateRightTopGradient(colors: string[], segments: number) {
  const gradient = [];
  const numColors = colors.length;
  for (let i = 0; i < numColors - 1; i++) {
    const color1 = colorNameToRGB(colors[i]);
    const color2 = colorNameToRGB(colors[i + 1]);
    for (let j = 0; j < segments; j++) {
      const t = j / segments;
      gradient.push(interpolateColor(color1, color2, t));
    }
  }
  gradient.push(colorNameToRGB(colors[numColors - 1]));
  return gradient;
}
// 生成右上角渐变色
export const gradientColors = generateRightTopGradient(
  ["red", "magenta", "blue", "cyan", "lime", "yellow", "red"],
  GRADIENT_SEGMENTS
);

// 彩虹条
// ["red", "magenta", "blue", "cyan", "lime", "yellow", "red"];
export const rainbowBar = [
  [255, 0, 0],
  [255, 0, 255],
  [0, 0, 255],
  [0, 255, 255],
  [0, 255, 0],
  [255, 255, 0],
  [255, 0, 0],
];
function toHex(value?: number) {
  if (value === undefined) return "00";
  return Math.round(value).toString(16).padStart(2, "0");
}
export const rgbToHex = (rgb: number[]) => {
  if (![3, 4].includes(rgb.length)) {
    throw new Error("请输入三色值");
  }
  let [r, g, b, a = 1] = rgb;
  a = getRange(a, 1);
  const _a = a === 1 ? "" : toHex(a * 255);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${_a}`;
};

export const hexToRgba = (hex: string) => {
  hex = hex.replace("#", "");
  if (![3, 4, 6, 8].includes(hex.length)) {
    throw new Error("请输入十六进制颜色代码");
  }

  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((s) => s + s)
      .join("");
  }
  if (hex.length === 6) {
    hex += "ff";
  }

  const rgb: number[] = [];
  for (let i = 0; i < 3; i++) {
    rgb.push(parseInt(hex.substring(i * 2, i * 2 + 2), 16));
  }
  const a = roundTo(parseInt(hex.substring(6, 8), 16) / 255, 4);
  return [...rgb, a];
};
export function interpolateColor(rgb1: number[], rgb2: number[], t: number) {
  if (t === 0) return rgb1;
  if (t === 1) return rgb2;

  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  const r = r1 + (r2 - r1) * t;
  const g = g1 + (g2 - g1) * t;
  const b = b1 + (b2 - b1) * t;

  return [Math.round(r), Math.round(g), Math.round(b)];
}
export function getSelectColor(x: number, y: number, rt_color?: number[]) {
  const h = SELECT_HEIGHT;
  const w = SELECT_WIDTH;
  // 示例调用
  const x1 = [255, 255, 255]; // 左上角颜色 (白色)
  const y1 = rt_color ?? [255, 0, 0]; // 右上角颜色 (红色)
  const x2 = [0, 0, 0]; // 左下角颜色 (黑色)
  const y2 = [0, 0, 0]; // 右下角颜色 (黑色)
  const u = 1 - (w - x) / w; // 水平方向
  const v = 1 - (h - y) / h; // 垂直方向

  return bilinearInterpolationRGB(x1, y1, x2, y2, u, v);
}

function bilinearInterpolationRGB(
  x1: number[],
  y1: number[],
  x2: number[],
  y2: number[],
  u: number,
  v: number
) {
  // 对 R、G、B 三个通道分别进行插值计算
  const interpolateChannel = (
    c1: number,
    c2: number,
    c3: number,
    c4: number,
    u: number,
    v: number
  ) => {
    const top = (1 - u) * c1 + u * c2;
    const bottom = (1 - u) * c3 + u * c4;
    return (1 - v) * top + v * bottom;
  };

  // 计算 R 通道的值
  const r = interpolateChannel(x1[0], y1[0], x2[0], y2[0], u, v);
  // 计算 G 通道的值
  const g = interpolateChannel(x1[1], y1[1], x2[1], y2[1], u, v);
  // 计算 B 通道的值
  const b = interpolateChannel(x1[2], y1[2], x2[2], y2[2], u, v);

  // 返回最终的 RGB 值
  return [Math.round(r), Math.round(g), Math.round(b)];
}

/** RGB → HSV，H: 0~360, S: 0~1, V: 0~1 */
export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
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

/** 使用 HSV 反算取色点在色板上的位置，O(1) */
export function findPositionForColor(targetColor: number[]) {
  const [r, g, b] = targetColor;
  const [h, s, v] = rgbToHsv(r, g, b);
  const rightTopIndex = Math.round(h / 360 * (gradientColors.length - 1));
  const x = s * SELECT_WIDTH;
  const y = (1 - v) * SELECT_HEIGHT;
  const rightTopColor = gradientColors[rightTopIndex];
  return { x, y, rightTopIndex, rightTopColor };
}
