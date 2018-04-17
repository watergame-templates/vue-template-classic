import AV from 'leancloud-storage'
import _ from 'lodash';
// 类型检查
export function typeCheck(type, val) {
  if (val === null || val === '') {
    return true
  }
  switch (type) {
    case 'String':
    case 'Phone':
    case 'Email':
      return typeof val === 'string'
      break;
    case 'Boolean':
      return typeof val === 'boolean'
      break;
    case 'Date':
    case 'DateTime':
    case 'Year':
    case 'YearMonth':
    case 'Time':
      return val instanceof Date
      break;
    case 'Integer':
    case 'Double':
    case 'EnumRedio':
      return typeof val === 'number'
      break;
    case 'Geo':
      return val instanceof AV.GeoPoint
      break;
    case 'Ref':
      return val instanceof AV.Point
      break;
    case 'Image':
      return val instanceof AV.File
      break;
    default:
      return false
      break;
  }
}

export function formatArray(to) {
  // 开发者模式检测类型
  if (process.env.NODE_ENV === 'development') {
    for (let key in to.query) {
      if (_.isString(to.query[key])) {
      } else if (_.isArray(to.query[key])) {
        if (to.query[key].some(i => {
          return !_.isString(i)
        })) {
          console.error('query中 Array 只能是一维数组')
        }
      }else {
        console.error('query只能是String,Array')
      }
    }
    for (let key in to.query) {
      if (_.isString(to.query[key])) {
      }else {
        console.error('params只能是String')
      }
    }
  }
}

export function formatArr_ (obj) {
  let j = {}
  for (let key in obj) {
    if (key.startsWith('arr_') && _.isArray(obj[key])) {
      j[key] = obj[key].join('|')
    } else {
      j[key] = obj[key]
    }
  }
  return j
}
export function testArr_(obj) {
  for (let key in obj.query) {
    if (key.startsWith('arr_') && _.isArray(obj[key])) {
      return true
    }
  }
  for (let key in obj.params) {
    if (key.startsWith('arr_') && _.isArray(obj[key])) {
      return true
    }
  }
  return false
}