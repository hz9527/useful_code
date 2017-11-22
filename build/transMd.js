var path = require('path')
var fs = require('fs')
var resolve = (p = '') => path.join(__dirname, '../src', p)
var list = [] // {name: xx, codeType: xx}
var child_process = require('child_process')
function run () {
  buildAll(() => {
    fs.watch(resolve('./mdPages'), (event, filename) => {
      child_process.exec('git branch', (err, st, sd) => {
        if (st.indexOf('* master') > -1) {
          if (event === 'change') {
            // 重写模版更新router
            buildItem(filename) // 暂不支持更改codeType
          } else {
            // 在list中查找，如果不存在则添加，如果存在则删除
            var ind = list.findIndex(item => item.name === filename)
            if (ind > -1) {
              delFile({name: list[ind].name.replace('.md', ''), codeType: list[ind].codeType})
              list.splice(ind, 1)
            } else {
              buildItem(filename, info => {
                list.push({name: filename, codeType: info.codeType})
              })
            }
          }
        }
      })
    })
  })
}

// ignore dir push .md
function getFileList () {
  return new Promise((suc, fail) => {
    fs.readdir(resolve('./mdPages'), (err, filelist) => {
      if (err) {
        fail(err)
      } else {
        list = filelist.filter(item => item.search(/.\md$/) > -1).map(item => {
          return {name: item}
        })
        suc(list)
      }
    })
  })
}

// trans md to info {name, codeType, tips, description, title, code: {type: xx, con: xx}}
function transMdToInfo (fileName) {
  return new Promise((suc, fail) => {
    fs.readFile(resolve('./mdPages/' + fileName), (err, fd) => {
      if (err) {
        fail(err)
      } else {
        var md = fd.toString()
        var result = {}
        result.name = fileName
        result.codeType = getContent(md, /## codeType\s?\n.+\n/g)
        result.tips = getContent(md, /## tips\s?\n.+\n/g)
        result.description = getContent(md, /## description\s?\n.+\n/g)
        result.title = getContent(md, /## title\s?\n(\s|\S)+##/g, true)
        result.code = getCode(md, /## pre\s?\n```(\s|\S)+```/g) // code type
        for (let key in result) {
          if (result[key] === false) {
            console.warn(`${key} is invaild`)
            suc(false)
            break
          }
        }
        if (!Object.keys(result).some(key => result[key] === false)) {
          result.title = result.title.replace(/## title\s?\n/, '').replace('##', '')
          suc(result)
        }
      }
    })
  })
}
function getContent (con, reg, all) {
  var result = con.match(reg)
  if (!result || result.length !== 1) {
    return false
  } else {
    return all ? result[0] : result[0].split(/\n/)[1]
  }
}
function getCode (con, reg) {
  var result = {}
  result.con = con.match(reg)
  if (!result.con || result.con.length !== 1) {
    return false
  }
  result.con = result.con[0]
  result.type = result.con.match(/```.+/g)
  result.con = result.con.split('```')[1]
  if (!result.type || result.type.length !== 1) {
    return false
  }
  result.type = result.type[0].replace('```', '')
  result.con = result.con.replace(result.type, '')
  return result
}

// trans info to .vue {name, codeType, description, tips, tem}
function transInfoToVue (info) {
  return {
    name: info.name.replace('.md', ''),
    codeType: info.codeType,
    description: info.description,
    tips: getTips(info.tips),
    tem: getTem(info)
  }
}
function getTips (tips) { // [x, y] [String, String]
  return tips.slice(1, -1).split(',').map(Function.prototype.call, String.prototype.trim).map(item => {
    if (Number(item) === item * 1) {
      return item
    } else {
      return `"${item}"`
    }
  }).join(', ')
}
function getTem (info) {
  return `<template lang="html">
    <div class="hz-page">
      <div class="hz-title">${info.title}</div>
      <pre v-hz-pre>
        <code class="${info.code.type}">
          ${info.code.con}
        </code>
      </pre>
    </div>
  </template>`
}

function addFile (info) { // {name, codeType, description, tips, tem}
  return new Promise((suc, fail) => {
    var dirPath = './pages/' + info.codeType
    if (!fs.existsSync(resolve(dirPath))) {
      fs.mkdirSync(resolve(dirPath))
    }
    fs.writeFile(resolve(dirPath + '/' + info.name + '.vue'), info.tem, (err) => {
      if (err) {
        console.log(err, 123)
      } else {// change Router file
        suc(info)
      }
    })
  })
}
function delFile (info) { // {name, codeType}
  // change Route
  fs.readFile(resolve('./router/index.js'), (err, fd) => {
    if (err) {
      console.log(err)
    } else {
      var con = fd.toString()
      var importReg = new RegExp(`import.+${info.name}.+${info.name}'\\n`, 'g')
      var routeReg = new RegExp(`{\\n{1}\\s{6}path:\\s+'/${info.name}'(\\s|\\S)+},`, 'g')
      con = con.replace(importReg, '').replace(routeReg, '').replace(/},(\s|\S)+{/g, '},\n    {')
      // del file
      if (fs.existsSync(resolve(`./pages/${info.codeType}/${info.name}.vue`))) {
        fs.unlinkSync(resolve(`./pages/${info.codeType}/${info.name}.vue`))
      }
      fs.writeFileSync(resolve('./router/index.js'), con)
    }
  })
}

function addRoute (infoList) { // add check is exists
  fs.readFile(resolve('./router/index.js'), (err, fd) => {
    if (err) {
      console.log(err)
    } else {
      var con = fd.toString()
      infoList.forEach(info => {
        var filePath = `import ${info.name} from '@/pages/${info.codeType}/${info.name}'`
        var route =
        `{
      path: '/${info.name}',
      name: '${info.name}',
      component: ${info.name},
      codeType: typeConf.${info.codeType},
      tips: getTips(${info.tips}),
      description: '${info.description}'
    }`
        // check exists 暂不支持判断更改codeType
        if (con.indexOf(filePath) > -1) { // exists
          var reg = new RegExp(`{(\s|\S)+path: '/${info.name}',(\s|\S)+
          }`)
          con = con.replace(reg, route)
        } else {
          con = con.replace('// @end - components', filePath + '\n// @end - components')
            .replace(/{\n\s{6}path: '\*',/, route + ",\n    {\n      path: '*',")
        }
      })
      fs.writeFile(resolve('./router/index.js'), con, (err) => {
        console.log(err)
      })
    }
  })
}

function buildAll (cb) {
  getFileList().then(list => {
    Promise.all(list.map(item => transMdToInfo(item.name)))
      .then(mdInfoList => {
        // 为方便watch中检查在此需要更新list为其添加codeType属性
        mdInfoList.forEach((item, i) => list[i]? (list[i].codeType = item.codeType) : '')
        mdInfoList = mdInfoList.filter(item => item)
        return Promise.all(mdInfoList.map(mdInfo => addFile(transInfoToVue(mdInfo))))
          .then(infoList => {
            addRoute(infoList)
            typeof cb === 'function' && cb()
          }).catch(e => e)
      }).catch(e => e)
  })
  .catch(err => console.log(err))
}

function buildItem (fileName, addCb) {
  transMdToInfo(fileName)
    .then(mdInfo => {
      if (!mdInfo) return
      typeof addCb === 'function' && addCb(mdInfo)
      addFile(transInfoToVue(mdInfo))
        .then(info => {
          addRoute([info])
        }).catch(e => e)
    }).catch(e => e)
}
// run()
module.exports = run
