<template lang="html">
  <div class="page" @click='clickItem'>
    <div class="code-type" v-for='(codeList, i) in list' :key='codeList.tit'>
      <div class="code-item" :data-ind='i'>{{codeList.tit}}</div>
      <div class="tip-con" v-for='(tipList, ind) in codeList.subTips' :key='tipList.tip' v-show='i === codeInd'>
        <div class="tip-item" :data-subind='ind'>{{tipList.tip}}</div>
        <div class="item" v-for='item in tipList.list' :key='item.path'
          v-show='ind === subInd' :data-info='item.path'>{{item.description}}</div>
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
  },
  methods: {
    clickItem (e) {
      var dataset = e.target.dataset
      if ('ind' in dataset) {
        this.codeInd = parseInt(dataset.ind)
        this.subInd = 0
      } else if ('subind' in dataset) {
        this.subInd = parseInt(dataset.subind)
      } else if ('info' in dataset) {
        this.$router.push({path: dataset.info})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.code-type {
  font-size: 14px;
}
.code-item {
  height: 30px;
  padding-left: 15px;
  line-height: 30px;
}
.tip-item {
  height: 25px;
  padding-left: 25px;
  background: #eee;
  line-height: 25px;
}
.item {
  height: 30px;
  padding-left: 30px;
  background: #aaa;
  line-height: 30px;
  font-size: 12px;
}
</style>
