import type { AttributifyAttributes } from "unocss/preset-attributify";

declare module "@vue/runtime-dom" {
  interface HTMLAttributes extends AttributifyAttributes {}
}

export {};

interface EyeDropper {
  new (): EyeDropper;
  open: (options?: { signal: AbortSignal }) => Promise<{ sRGBHex: string }>;
}

declare global {
  interface Window {
    EyeDropper: EyeDropper;
  }
}
