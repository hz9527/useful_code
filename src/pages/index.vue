<template lang="html">
  <div class="page">
    <div class="code-type" v-for='(codeList, i) in list' :key='codeList.tit' v-show='i === codeInd'>
      <div class="code-item">{{codeList.tit}}</div>
      <div class="tip-item" v-for='(tipList, ind) in codeList.subTips' :key='tipList.tip'>
        <div class="tip-item">{{tipList.tip}}</div>
        <div class="item" v-for='item in tipList.list' :key='item.path' v-show='ind === subInd'>{{item.description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import getMenu from '../utils/getMenu'
export default {
  data () {
    return {
      codeInd: 0,
      subInd: 0,
      list: [] // {tit: String, subTips: [{tip: xx, list: []}]} // all tips
    }
  },
  created () {
    this.list = getMenu(this.$router.options.routes.slice(1, -1))
  }
}
</script>

<style lang="scss" scoped>
.code-type {}
</style>
