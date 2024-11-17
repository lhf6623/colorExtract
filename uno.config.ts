import {
  defineConfig,
  presetIcons,
  presetUno,
  presetAttributify,
  transformerAttributifyJsx,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
  shortcuts: {
    "flex-center": "flex justify-center items-center",
  },
  transformers: [transformerAttributifyJsx(), transformerVariantGroup()],
});
