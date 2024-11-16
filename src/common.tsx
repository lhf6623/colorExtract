import { computed, defineComponent, reactive, ref, watch } from "vue";
import { hexToRgba, rgbToHex } from "./color";

export const Grids = defineComponent({
  props: {
    col: {
      type: Number,
      default: 6,
    },
    row: {
      type: Number,
      default: 6,
    },
  },
  setup({ col, row }) {
    const _row = Array(row).fill(0);
    const _col = Array(col).fill(0);
    return () => (
      <div class='w-full h-full'>
        {_row.map((_, i) => {
          // 第一个颜色
          let color = i % 2 === 0 ? "bg-#cdcdcd" : "bg-#fff";
          return (
            <div class='flex flex-row'>
              {_col.map(() => {
                // 返回轮换的颜色
                color = color === "bg-#cdcdcd" ? "bg-#fff" : "bg-#cdcdcd";
                return <div class={`w-6px h-6px ${color}`}></div>;
              })}
            </div>
          );
        })}
      </div>
    );
  },
});
export function ColorGradient(props: { color: string[] }) {
  const color = props.color?.join(",");
  return <div style={`background: linear-gradient(to right, ${color});`}></div>;
}

export const ColorDropper = defineComponent({
  emits: ["change"],
  setup(_, { emit }) {
    const active = ref("");
    function handleEyeDropper() {
      active.value = "active";
      if (!window.EyeDropper) {
        throw new Error("你的浏览器不支持 EyeDropper API");
      }
      if (active.value) {
        const eyeDropper = new window.EyeDropper();
        eyeDropper
          .open()
          .then(({ sRGBHex }) => {
            const rgb = hexToRgba(sRGBHex);
            emit("change", rgb);
          })
          .finally(() => {
            active.value = "";
          });
      }
    }
    return () => (
      <div
        onClick={handleEyeDropper}
        class={`${active.value} flex-center group/dropper w-26px h-26px @dark-hover-bg-#484848 @dark-active:bg-#48484888 hover-bg-#efefef99 active-bg-#efefefff flex-center rounded-2px`}
      >
        <i class='text-22px @dark:text-white text-#1f1f1f @dark-group-[.active]/dropper:text-#7cacf8 group-[.active]/dropper:text-#1c6ef3 i-fluent-eyedropper-16-regular'></i>
      </div>
    );
  },
});

export const CopyColor = defineComponent({
  props: {
    color: String,
  },
  setup(props) {
    function handleCopy() {
      navigator.clipboard.writeText(props.color);
    }

    return () => (
      <div class='relative overflow-hidden w-32px h-32px rounded-full'>
        <div
          onClick={handleCopy}
          style={{ background: `${props.color}` }}
          class='group absolute top-0 left-0 z-1 b-solid b-1px @dark:b-#fff b-#c7c7c7 overflow-hidden w-32px h-32px rounded-full flex-center transition-all'
        >
          <div class=' w-full bg-#fff4 active:bg-#fff5 h-full hidden group-hover:flex flex-center'>
            <i class='text-white w-18px h-18px mix-blend-difference i-fluent-copy-32-light'></i>
          </div>
        </div>
        <Grids col={6} row={6} />
      </div>
    );
  },
});
