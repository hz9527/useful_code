<template lang="html">
  <div :class="['nav', page === 'index' ? 'index-nav' : 'con-nav']">
    <div class="back"><b></b></div>
    <div class="title" v-show='!(showInput && page === "index")'>{{title}}</div>
    <div class="input" v-show='showInput && page === "index"'>
      <input type="text" placeholder='search tip codetype or description' ref='input' @input.lazy='input' @blur='blur'>
      <span v-show='showList' @click='clear'>clear</span>
    </div>
    <div class="icon"><b @click='iconClick'></b></div>
    <div class="list-panel" v-show='showList'>
      <div class="no-data" v-show='list.length === 0'>暂无搜索结果</div>
      <div class="list" v-show='list.length > 0' @click='clickItem'>
        <div class="list-item" v-for='item in list' :key='item.path' :data-info='item.path'>{{item.description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import searchList from '../utils/getSearchList'
export default {
  data () {
    return {
      page: 'index', // index content
      title: '首页',
      showInput: false,
      showList: false,
      _keyWord: '',
      _allList: null,
      list: [],
      _clear: false
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (v) {
        if (v.name === 'index') {
          this.page = 'index'
          this.title = '首页'
        } else {
          let item = this._allList.find(item => item.path === v.path)
          this.page = 'content'
          this.title = item.description
        }
      }
    }
  },
  beforeCreate () {
    this._allList = this.$router.options.routes.slice(1, -1)
  },
  methods: {
    clickItem (e) {
      if ('info' in e.target.dataset) {
        this.$router.push({path: e.target.dataset.info})
      }
    },
    iconClick () {
      if (this.page === 'index') {
        this.showInput = true
        this.$nextTick(() => {
          this.$refs.input.focus()
          if (this._keyWord) {
            this.$refs.input.value = this._keyWord
            this.showList = true
          }
        })
      } else {
        this.$router.push({path: '/'})
      }
    },
    input (e) {
      let keyWord = e.target.value.trim()
      if (keyWord !== this._keyWord) {
        this._keyWord = keyWord
        if (this._keyWord) {
          !this.showList && (this.showList = true)
          this.list = searchList(this._keyWord, this._allList)
        }
      }
      if (!keyWord) {
        this.showList = false
      }
    },
    clear (e) {
      this._clear = true
      this.list = []
    },
    blur () {
      this.$nextTick(() => {
        if (this._clear) {
          this._clear = false
          this.$refs.input.focus()
          this._keyWord = this.$refs.input.value = ''
        } else {
          this.showInput = false
        }
        this.showList = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
@import '../styles/mixin.scss';
.nav {
  padding: 10px 15px;
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  .back, .icon {
    width: 16px;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .title, .input {
    flex-grow: 1;
    text-align: center;
  }
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .icon b {
    display: inline-block;
    width: 16px;
    height: 16px;
    @include bg-image('../assets/icons/search');
    vertical-align: middle;
  }
}
.index-nav {
  color: #fff;
  background: $navBg;
  position: relative;
  .input {
    position: relative;
  }
  .input input{
    box-sizing: border-box;
    width: 90%;
    margin: 0;
    padding: 3px 5px;
    background: $navBgCon;
    border: 0;
    outline: 0;
  }
  .input span {
    position: absolute;
    top: 0%;
    right: 8%;
    color: #666;
    line-height: 20px;
  }
  .list-panel {
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    max-height: 200px;
    top: 100%;
    left: 0;
    padding: 10px 15px;
    background: $navBgCon;
    box-shadow: 0px 2px 10px #999;
    overflow: auto;
    .no-data {
      text-align: center;
      line-height: 50px;
      color: #999;
    }
    .list-item {
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #333;
      font-size: 12px;
    }
  }
}
.con-nav {
  background: $navBgCon;
  color: $titColor;
  .icon b {
    @include bg-image('../assets/icons/home');
  }
}
</style>
