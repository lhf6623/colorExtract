import { computed, defineComponent, ref } from "vue";

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

export const CopyColor = defineComponent({
  props: {
    color: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const isCopy = ref(false);
    let tim: NodeJS.Timeout | null = null;

    function handleCopy() {
      navigator.clipboard.writeText(props.color);
      isCopy.value = true;
      if (tim) {
        clearTimeout(tim);
        tim = null;
      }
      tim = setTimeout(handleMouseout, 3000);
    }
    const icon = computed(() =>
      isCopy.value
        ? "i-ph-checks-light !text-green"
        : "text-white i-fluent-copy-32-light"
    );
    function handleMouseout() {
      isCopy.value = false;
    }
    return () => (
      <div class='relative overflow-hidden w-32px h-32px rounded-full'>
        <div
          onMouseout={handleMouseout}
          onClick={handleCopy}
          style={{ background: `${props.color}` }}
          class='group absolute top-0 left-0 z-1 b-solid b-1px @dark:b-#fff b-#c7c7c7 overflow-hidden w-32px h-32px rounded-full flex-center transition-all'
        >
          <div class='w-full bg-#fff4 active:bg-#fff5 h-full hidden group-hover:flex flex-center'>
            <i class={`w-18px h-18px mix-blend-difference ${icon.value}`}></i>
          </div>
        </div>
        <Grids col={6} row={6} />
      </div>
    );
  },
});
