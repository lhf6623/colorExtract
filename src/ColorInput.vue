<template>
  <div class="flex items-center justify-between px-16px">
    <div class="w-178px text-center">
      <div class="flex justify-between flex-row">
        <input
          v-for="(text, index) in data"
          :style="{ width: cls }"
          :type="type === 'hex' ? 'text' : 'number'"
          :value="text"
          @input="(e) => handleChange(e, index)"
          class="h-24px appearance-none active-bg-#fff @dark:active-bg-#282828 active-b-#3972d8 @dark:active-b-#8fa6d5 hover-bg-#f2f2f2 @dark:hover-bg-#3d3d3d @dark:hover-b-#7a7a7a text-center outline-none focus-bg-#fff focus-b-#3972d8 @dark:focus-b-#8fa6d5 @dark:focus-bg-#282828 bg-#fff @dark:bg-#282828 @dark:b-#757575 rounded-4px @dark:text-#e3e3e3 b-solid b-1px"
        />
      </div>
      <div
        class="w-full py-3px text-12px h-24px text-#aaaaaa @dark:text-#6f6f6f"
      >
        <span
          v-for="text in color_text_arr"
          class="inline-block"
          :style="{ width: cls }"
        >
          {{ text }}
        </span>
      </div>
    </div>

    <div
      class="text-14px relative inline-block w-16px h-22px text-#474747 @dark:text-#fff"
    >
      <label for="select" class="inline-block cursor-pointer">
        <i class="w-16px h-22px i-ph-caret-up-down-light"></i>
      </label>
      <select
        :value="props.type"
        @change="handleChangeType"
        id="select"
        class="absolute w-16px h-22px top-0 left-0 opacity-0 cursor-pointer"
      >
        <option value="hex">{{ rgbToHex(props.color) }}</option>
        <option value="rgba">{{ rgba }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { hexToRgba, rgbToHex } from "./color";
  import { getInt } from "./util";

  const props = defineProps({
    color: {
      type: Array<number>,
      default: () => [],
    },
    type: {
      type: String,
      default: "hex",
    },
  });

  const emit = defineEmits<{
    (e: "colorChange", color: number[]): void;
    (e: "typeChange", type: "hex" | "rgba"): void;
  }>();

  const isDraw = ref(true);

  function testHex(hex: string) {
    hex = hex.replace("#", "").toLowerCase();
    if (![3, 4, 6, 8].includes(hex.length)) return false;
    // 用正则判断十六进制字符
    return /^[0-9a-f]+$/.test(hex);
  }
  function testRgba(data: number, index: number) {
    if (isNaN(data)) return false;
    if (index < 3 && data >= 0 && data <= 255) return true;
    if (index === 3 && data >= 0 && data <= 1) return true;
    return false;
  }
  let tim = 0;
  let timt: NodeJS.Timeout | null = null;
  function handleChange(e: Event, index: number) {
    const value = (e.target as HTMLInputElement).value;
    if (props.type === "hex" && testHex(value)) {
      data.value[index] = value;
      emit("colorChange", hexToRgba(value));
    }
    if (props.type === "rgba" && testRgba(+value, index)) {
      data.value[index] = value;
      if (Date.now() - tim > 1000) {
        emit(
          "colorChange",
          data.value.map((n) => +n)
        );

        tim = Date.now();
      }
    }

    isDraw.value = false;
    if (timt) {
      clearTimeout(timt);
      timt = null;
    }
    timt = setTimeout(() => {
      isDraw.value = true;
    }, 1000);
  }

  const data = ref<(number | string)[]>(
    props.type === "hex" ? [rgbToHex(props.color)] : [...props.color]
  );

  watch(
    () => props.type,
    () => {
      data.value =
        props.type === "hex" ? [rgbToHex(props.color)] : [...props.color];
    }
  );

  watch(
    () => props.color,
    () => {
      if (isDraw.value) {
        data.value =
          props.type === "hex" ? [rgbToHex(props.color)] : [...props.color];
      }
    }
  );

  const color_text_arr = computed(() => {
    return props.type === "hex" ? ["十六进制"] : ["R", "G", "B", "A"];
  });

  const cls = computed(() => {
    return props.type === "hex" ? "178px" : "40px";
  });
  const rgba = computed(() => {
    const [r, g, b, a] = props.color;

    const _a = a === 1 ? "" : ` / ${getInt(a * 100)}%`;
    return `rgba(${r} ${g} ${b}${_a})`;
  });

  function handleChangeType(e: Event) {
    const value = (e.target as HTMLInputElement).value as "hex" | "rgba";
    emit("typeChange", value);
  }
</script>

<style scoped>
  input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
    -webkit-appearance: none; /* Chrome, Safari */
    appearance: none; /* 现代浏览器 */
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none; /* Chrome */
  }
</style>
