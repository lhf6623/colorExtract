<template>
  <div
    class="shadow w-232px rounded-2px box-border @dark:bg-#282828 bg-white select-none pb-4px"
  >
    <MoveArea
      :x="selectLoc.x"
      :y="selectLoc.y"
      @change="handleSelectColor"
      :exceed="true"
    >
      <div class="select bg-blend-multiply h-128px w-full"></div>
    </MoveArea>
    <div
      class="flex items-center justify-between py-16px px-16px *:flex-shrink-0"
    >
      <ColorDropper @change="getDropperColor" />
      <CopyColor :color="targetColorCss" ml--5px />
      <div class="flex flex-col gap-8px">
        <MoveArea :y="6" :x="rainbowX" :lock="['y']" @change="getRainbowColor">
          <ColorGradient
            :color="rainbowBarCss"
            class="h-12px w-130px bg-#fff rounded-2px"
          />
          <template #moveBox>
            <div
              class="bg-white cursor-ew-resize @dark-bg-#3c3c3c w-full h-full"
            ></div>
          </template>
        </MoveArea>
        <MoveArea :y="6" :x="alpha * barWidth" :lock="['y']" @change="getAlpha">
          <div class="relative h-12px w-130px rounded-2px overflow-hidden">
            <ColorGradient
              :color="['transparent', rgbToHex(targetColor)]"
              class="w-full h-full z-1 absolute top-0 left-0"
            />
            <Grids :row="2" :col="22" />
          </div>
          <template #moveBox>
            <div
              class="bg-white cursor-ew-resize @dark-bg-#3c3c3c w-full h-full"
            ></div>
          </template>
        </MoveArea>
      </div>
    </div>
    <ColorInput
      :color="inputRef"
      :type="colorType"
      @colorChange="changeInput"
      @typeChange="inputTypeChange"
    />
  </div>
</template>

<script lang="tsx" setup>
  import { computed, reactive, ref } from "vue";
  import MoveArea from "./MoveArea.vue";
  import {
    getSelectColor,
    rgbToHex,
    rainbowBar,
    gradientColors,
    findPositionForColor,
  } from "./color";
  import { ColorDropper, CopyColor, ColorGradient, Grids } from "./common";
  import { getRange, getInt } from "./util";
  import ColorInput from "./ColorInput.vue";
  // hex rgba
  const colorType = ref<"hex" | "rgba">("rgba");

  // 单一颜色选择
  const selectLoc = reactive({
    x: 0,
    y: 0,
  });
  // 彩虹条 x 轴位置
  const rainbowX = ref(0);
  const selectColor = ref([255, 0, 0]);
  const selectColorCss = computed(() => rgbToHex(selectColor.value));
  const barWidth = 130;

  // 目标颜色
  const targetColor = ref([255, 255, 255]);
  const alpha = ref(1);

  const targetColorCss = computed(() => {
    const [r, g, b, a] = [...targetColor.value, alpha.value];

    const hex = rgbToHex([r, g, b, a]);

    const _a = a === 1 ? "" : ` / ${getInt(a * 100)}%`;
    const rgba = `rgba(${r} ${g} ${b}${_a})`;

    return colorType.value === "hex" ? hex : rgba;
  });

  const rainbowBarCss = computed(() => {
    return rainbowBar.map((color) => rgbToHex(color));
  });
  // const inputRef = ref(["11"]);
  const inputRef = computed(() => {
    return [...targetColor.value, alpha.value];
  });
  function inputTypeChange(type: "hex" | "rgba") {
    colorType.value = type;
  }

  function changeInput([r, g, b, a]: number[]) {
    getDropperColor([r, g, b, a]);
  }

  function getDropperColor([r, g, b, a]: number[]) {
    targetColor.value = [r, g, b];
    const { x, y, rightTopIndex, rightTopColor } = findPositionForColor(
      targetColor.value
    );

    selectLoc.x = getRange(Math.round(x * 232) | 0, 232);
    selectLoc.y = getRange(Math.round(y * 128) | 0, 128);
    rainbowX.value = rightTopIndex;
    selectColor.value = rightTopColor;
    alpha.value = a;
  }

  function getRainbowColor(x: number) {
    const rgb3 = gradientColors[x | 0];
    selectColor.value = rgb3;
    // 根据 select 的 x y 坐标，计算出颜色
    const { x: select_x, y } = selectLoc;
    targetColor.value = getSelectColor(select_x, y, rgb3);
  }

  function getAlpha(x: number) {
    alpha.value = getRange(getInt(x / barWidth, 2), 1);
  }
  function handleSelectColor(x: number, y: number) {
    selectLoc.x = x;
    selectLoc.y = y;
    targetColor.value = getSelectColor(x, y, [255, 0, 0]);
  }
</script>

<style scoped>
  .select {
    --color: v-bind("selectColorCss");
    background: linear-gradient(to right, #fff, var(--color)),
      linear-gradient(to bottom, transparent, #000);
  }
</style>
