// route {path name component, codeType String, tips Array, description String}
function search (keyWord, list) {
  let keyArr = keyWord.split(' ')
  return list.filter(item => keyArr.some(info => info === item.codeType || item.description.indexOf(info) > -1 ||
    item.tips.some(tip => tip === info)))
}

let searchList = (function () {
  let cache = {}
  return function (keyWord, list) {
    if (list) {
      if (keyWord in cache) {
        return cache[keyWord]
      } else {
        let result = search(keyWord, list)
        cache[keyWord] = result
        return result
      }
    } else {
      cache = {}
    }
  }
})()
export default searchList
