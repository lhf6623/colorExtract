<template>
  <div class="w-232px @dark:bg-#282828 bg-white">
    <ColorExtract></ColorExtract>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import ColorExtract from "./ColorExtract.vue";
  onMounted(() => {
    // 禁止右键
    document.oncontextmenu = function (e) {
      if (import.meta.env.PROD) {
        e.preventDefault();
      }
    };
  });
</script>

<style>
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    font-weight: normal;
  }

  body {
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    font-size: 15px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow: hidden;
  }

  #app {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
</style>
