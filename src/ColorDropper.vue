<template>
  <div
    @click="handleEyeDropper"
    :class="`${active} flex-center group/dropper w-26px h-26px @dark-hover-bg-#484848 @dark-active:bg-#48484888 hover-bg-#efefef99 active-bg-#efefefff flex-center rounded-2px`"
  >
    <i
      class="text-22px @dark:text-white text-#1f1f1f @dark-group-[.active]/dropper:text-#7cacf8 group-[.active]/dropper:text-#1c6ef3 i-fluent-eyedropper-16-regular"
    ></i>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from "vue";
  import { hexToRgba } from "./color";

  const emit = defineEmits(["change"]);
  const active = ref("");

  onMounted(() => {
    window.addEventListener("keydown", closeListener);
  });

  async function handleEyeDropper() {
    active.value = "active";
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

  onUnmounted(() => {
    window.removeEventListener("keydown", closeListener);
  });

  function close() {
    active.value = "";
  }
  function closeListener(e: { key: string }) {
    if (e.key === "Escape") {
      close();
    }
  }
</script>
