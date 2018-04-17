/* eslint-disable */
import axios from 'axios'
import { baseURL } from './config';
import { querystring } from 'vux'
import { getStorage } from 'core/context';
import QRCode from 'qrcode'

const NOOP = () => { }

const instance = axios.create({
  // baseURL: 'http://lztogether.leanapp.cn/',
  timeout: 5000,
  withCredentials: false,
  auth: {
    username: '',
    password: ''
  },
  headers: {
    'Accept': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded'
    // 'X-CSRFToken': getCookie('csrftoken')
  }
})
// 请求之前
if (instance.defaults.requestUse && instance.defaults.requestUse.length > 0) {
  instance.defaults.requestUse.forEach(i => {
    instance.interceptors.request.use(i)
  })
}

// 请求完成
instance.interceptors.response.use(response => {
  return response.data
}, err => {
  // console.log(err.response.data)
  if (err.response) {
    // 封装错误拦截提示
    if (err.response.data) {
      if (err.response.data.reason) {
        instance.defaults.showError(err.response.data.reason)
      } else {
        instance.defaults.showError(err.response.data)
      }
    } else {
      instance.defaults.showError(err.response)
    }
    axios.post('/v1/error', err.response)
    return Promise.reject(err.response.data)
  }
  instance.defaults.showError(err.response)
  return Promise.reject({ code: 1024, message: err.message })
})

instance.defaults = {
  showError: NOOP,
  requestUse: []
}

export let http = {
  name: 'http',
  install(Vue, options = {}) {
    Object.assign(instance.defaults, options)

    Vue.http = instance

    Vue.prototype.$http = instance
  }
}

/**
* 跨域
* @param url
* @param callbackName 回调方法名
* @param callback 回调方法
* @constructor
*/
export function jsonp(url, callbackName, callback) {
  let script = document.createElement('script');
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script);
  window[callbackName] = callback;
}

// export function goPrjPage(prj, path = '/') {
//   if (prj) {
//     if (process.env.NODE_ENV === 'development') {
//       return window.location.href = baseURL + prj + '/?#' + path
//     }
//     if (process.env.PROJECT_BUILD_TYPE === 'wx') {
//       return window.location.href = '../' + prj + '/?#' + path
//     }
//     return window.location.href = '../' + prj + '/index.html#' + path
//   } else {
//     if (/^http/i.test(path)) {
//       if (process.env.NODE_ENV === 'development') {
//         return window.location.href = path
//       }
//       if (process.env.PROJECT_BUILD_TYPE === 'wx') {
//         return window.location.href = path
//       }
//       return window.cordova.InAppBrowser.open(path, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
//     }
//   }

// }
// export function goPrjUrl(prj, path = '/') {
//   if (process.env.NODE_ENV === 'development') {
//     return baseURL + prj + '/?#' + path
//   }
//   if (process.env.PROJECT_BUILD_TYPE === 'wx') {
//     return '../' + prj + '/?#' + path
//   }
//   return '../' + prj + '/index.html#' + path
// }
export function getShareUrl(href, route) {
  // 增加分享人
  let url
  let search
  url = href.replace('/index.html', '')
  if (url.indexOf('?#') > 0) {
    let url1 = href.split('?#')[0]
    let url2 = href.split('?#')[1]
    let b = url2.split('?')[0]
    url = url1 + '?#' + b
    console.log(url);
    search = url2.split('?')[1]
  } else {
    url = href.split('?')[0]
    search =  href.split('?')[1]
  }
  let queryObj = querystring.parse(search)
  let currentPhone
  try {
    currentPhone = AV.User.current().toJSON().mobilePhoneNumber
  } catch (error) {
    currentPhone = '18888888888'
  }
  // 保存上一个分享人
  window.shareby = currentPhone || queryObj.shareby || '1888888888'
  let res = getStorage('wechatUserInfo')
  if (res && res.openid) {
    queryObj.shareby = res.openid
  } else {
    queryObj.shareby = window.shareby
  }
  if (queryObj.code) {
    delete queryObj.code
  }
  if (route) {
    return `${baseURL}${prj}/?#${route.path}?${querystring.stringify(queryObj)}`
  } else {
    return `${url}?${querystring.stringify(queryObj)}`
  }
}


export function getImgElement(url) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = e => resolve(img)
    img.onerror = e => reject(e)
    img.src = url
  })
}

export function getCanvasQR(url) {
  let tcanvas = document.createElement('canvas')
  QRCode.toCanvas(tcanvas, url, function (error) {
    if (error) console.error(error)
  })
  return tcanvas
}