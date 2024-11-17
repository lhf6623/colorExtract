<template>
  <div ref="moveArea" class="move-area relative cursor-crosshair">
    <slot></slot>
    <div class="move-box absolute z-1 cursor-move">
      <div
        class="move-test overflow-hidden rounded-full flex-shrink-0 cursor-move"
      >
        <slot name="moveBox"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    useTemplateRef,
    watchEffect,
  } from "vue";
  import { getRange } from "./util";
  const selectColorRef = useTemplateRef("moveArea");

  const loc = reactive({ x: 0, y: 0 });
  let rect = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  const isDown = ref(false);

  const { x, y, exceed, lock } = defineProps({
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    exceed: {
      type: Boolean,
      default: false,
    },
    lock: {
      type: Array<"x" | "y">,
      default: () => [],
    },
  });

  const emits = defineEmits<{
    (e: "change", x: number, y: number): void;
  }>();

  const isExceed = computed(() => (exceed ? "hidden" : ""));

  function update(e: MouseEvent) {
    if (!isDown.value) return;
    if (!lock.includes("x")) {
      loc.x = getRange(e.pageX - rect.left, rect.width);
    }
    if (!lock.includes("y")) {
      loc.y = getRange(e.pageY - rect.top, rect.height);
    }

    emits("change", loc.x, loc.y);
  }

  function start(e: MouseEvent) {
    isDown.value = true;
    update(e);
    document.addEventListener("mousemove", update);
  }

  function stop() {
    isDown.value = false;
    document.removeEventListener("mousemove", update);
  }
  function getDomClient() {
    const { width, height, left, top } =
      selectColorRef.value!.getBoundingClientRect();
    rect = { width, height, left, top };
  }

  onMounted(() => {
    // 创建一个 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(() => {
      getDomClient();
    });

    // 开始观察该 div 的大小变化
    resizeObserver.observe(selectColorRef.value!);

    selectColorRef.value!.addEventListener("mousedown", start);
    document.addEventListener("mouseup", stop);

    window.addEventListener("resize", getDomClient);
  });

  onUnmounted(() => {
    selectColorRef.value?.removeEventListener("mousedown", start);
    document?.removeEventListener("mouseup", stop);

    window.removeEventListener("resize", getDomClient);
  });

  watchEffect(() => {
    loc.x = x;
    loc.y = y;
  });
</script>

<style scoped>
  .move-area {
    --t: v-bind("loc.y");
    --l: v-bind("loc.x");
    overflow: v-bind("isExceed");
  }

  .move-box {
    top: calc(var(--t) * 1px);
    left: calc(var(--l) * 1px);
    width: 0px;
    height: 0px;
    transform: translate3d(50%, 50%, 0);
  }

  .move-test {
    background-color: transparent;
    --size: 15px;
    width: var(--size);
    height: var(--size);
    transform: translate3d(calc(50% - 15px), calc(50% - 15px), 0);
    box-shadow: inset 0 0 2px 1px rgba(255, 255, 255, 1),
      inset 0 0 0px 1px rgba(0, 0, 0, 1), 0 0 4px 1px rgba(0, 0, 0, 0.2);
  }
</style>
