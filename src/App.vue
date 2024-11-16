<template>
  <div class="app">
    <ColorExtract></ColorExtract>
  </div>
</template>

<script setup lang="tsx">
  import ColorExtract from "./ColorExtract.vue";
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
    min-height: 100vh;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    font-size: 15px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
  }

  #app {
    margin: 0;
    padding: 0;
    height: 100vh;
  }
  .app {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
