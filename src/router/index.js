import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import randomStr from '@/pages/js/randomStr'
import resetCss from '@/pages/css/resetCss'
// @end - components

Vue.use(Router)
const typeConf = {
  css: 'css',
  js: 'js'
}
const tipConf = { // ind 0 is default value
  target: ['common', 'mobile', 'pc', 'serve'],
  type: ['base', 'forward', 'skill']
}
function getTips (args) {
  return Object.keys(tipConf).map((key, i) => {
    var result = []
    if (args[i]) { // check valid & 0 is default
      var type = typeof args[i]
      if (type === 'string') {
        tipConf[key].some(item => item === args[i]) && result.push(args[i])
      } else if (type === 'number') {
        args[i] < tipConf[key].length && result.push(tipConf[key][args[i]])
      } else { // array
        result = args[i].filter(item => tipConf[key].some(itm => item === itm))
      }
    }
    if (result.length === 0) {
      result.push(tipConf[key][0])
    }
    return result
  }).reduce((res, next) => res.concat(next))
}

// route {path name component, codeType, tips, description}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/randomStr',
      name: 'randomStr',
      component: randomStr,
      codeType: typeConf.js,
      tips: getTips(1, 1),
      description: '获取0-9a-z10位数随机字符串'
    },
    {
      path: '/resetCss',
      name: 'resetCss',
      component: resetCss,
      codeType: typeConf.css,
      tips: getTips(1, 1),
      description: 'reset css'
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
