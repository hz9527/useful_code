export default function (routes) {
  var result = {} // codetype => subTips: {tip list}
  routes.forEach(ro => {
    var route = {
      codeType: ro.codeType,
      tips: ro.tips,
      description: ro.description,
      path: ro.path
    }
    if (route.codeType in result) {
      result[route.codeType].subTips.all.push(route)
    } else {
      result[route.codeType] = {
        subTips: {
          all: [route]
        }
      }
    }
    route.tips.forEach(tip => {
      if (tip in result[route.codeType].subTips) {
        result[route.codeType].subTips[tip].push(route)
      } else {
        result[route.codeType].subTips[tip] = [route]
      }
    })
  })
  return Object.keys(result).map(key => {
    var subTips = Object.keys(result[key].subTips).map(tip => {
      return {
        tip: tip,
        list: result[key].subTips[tip]
      }
    })
    return {
      tit: key,
      subTips: subTips
    }
  })
}
