<template>
  <div id="app" class="bg-gray-100 dark:bg-gray-800">
    <Minesweeper/>
  </div>
</template>

<script>
import Minesweeper from './components/Minesweeper.vue'

export default {
  name: 'App',
  components: {
    Minesweeper
  }
}
</script>

<style lang="css">
  @import "./assets/styles/index.css";
</style>