<template>
  <div id="app">
    <top-nav />
    <router-view/>
  </div>
</template>

<script>
import topNav from './pages/nav'
export default {
  name: 'app',
  components: {topNav}
}
</script>

<style lang='scss'>
@import './styles/index.scss';
</style>
