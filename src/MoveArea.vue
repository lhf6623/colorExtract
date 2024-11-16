<template>
  <div ref="moveArea" class="move-area relative cursor-crosshair">
    <slot></slot>
    <div class="move-box absolute overflow-hidden rounded-full z-1 cursor-move">
      <slot name="moveBox"></slot>
    </div>
  </div>
</template>

<script lang="tsx" setup>
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
  let rect: Partial<DOMRect> = {};
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
    rect = selectColorRef.value.getBoundingClientRect();
  }

  onMounted(() => {
    getDomClient();
    selectColorRef.value.addEventListener("mousedown", start);
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
    --size: 14px;
    top: calc(var(--t) * 1px - 6px);
    left: calc(var(--l) * 1px - 6px);
    width: var(--size);
    height: var(--size);
    background-color: transparent;
    box-shadow: inset 0 0 2px 1px rgba(255, 255, 255, 1),
      inset 0 0 0px 1px rgba(0, 0, 0, 1), 0 0 4px 1px rgba(0, 0, 0, 0.2);
  }
</style>
