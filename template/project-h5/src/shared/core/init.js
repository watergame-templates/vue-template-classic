import axios from 'axios'
import AV from 'leancloud-storage'
import { config } from 'utils/config'
import { showErr, showMsg, app, getStorage, goPrjPage, goPrjUrl, getShareUrl, getSharelogFun } from 'core/context'
import { querystring } from 'vux'
import _ from 'lodash';

/**
 * 初始化微信JS SDK
 */
export async function initWechatSDK(wx, wxconfig = {}, to) {
  
  if (process.env.NODE_ENV === 'development') {
    return 'development'
  }
  if (config.project_build_type !== 'wx') {
    return 'app'
  }
  
  let params = {
    params: {
      url: window.location.href.split('#')[0]
    }
  }

  let res
  try {
    res = await axios.get(app.url.getWechatConfig, params)
  } catch (err) {
    throw new Error(err)
  }
  wx.ready(function () {
    // alert('init wechat success')
    let config2 = {}
    for (let i in wxconfig) {
      if (wxconfig[i] !== '') {
        config2[i] = wxconfig[i]
      }
    }
    const defaultConfig = {
      "title": "联众同行",
      "desc": "“联”手同行·“众”享健康",
      "link": window.location.href,
      "imgUrl": "http://ac-0smsjobq.clouddn.com/c6bfefa928c49983667a.jpg"
    }
    // 发送给朋友
    let wxShareConfig = Object.assign({}, defaultConfig, config2)
    if (_.isArray(to.meta.sharelog)) {
      let fun = getSharelogFun(to, 1)
      wxShareConfig["success"] = fun
    }
    wxShareConfig.link = getShareUrl(window.location.href)
    if (!wxShareConfig.enable) {
      wx.hideMenuItems({
        menuList: [
          'menuItem:share:appMessage',
          'menuItem:share:timeline',
          'menuItem:share:qq',
          'menuItem:share:QZone',
          'menuItem:share:weiboApp',
          'menuItem:share:facebook'
        ]
      })
    } else {
      wx.showMenuItems({
        menuList: [
          'menuItem:share:appMessage',
          'menuItem:share:timeline',
          'menuItem:share:qq',
          'menuItem:share:QZone',
          'menuItem:share:weiboApp',
          'menuItem:share:facebook'
        ]
      })
      wx.onMenuShareAppMessage(wxShareConfig)
      // 分享到朋友圈
      wx.onMenuShareTimeline(wxShareConfig)
      // 分享到QQ
      wx.onMenuShareQQ(wxShareConfig)
      // 分享到QQ空间
      wx.onMenuShareQZone(wxShareConfig)
      // 分享到微博
      wx.onMenuShareWeibo(wxShareConfig)
    }

    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    // showMsg('wechat sdk init success')
  })
  wx.error(function (res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    showMsg('wechat sdk init fail')
    throw new Error(res)
  })
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: res.data.appId, // 必填，公众号的唯一标识
    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
    nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
    signature: res.data.signature, // 必填，签名，见附录1
    jsApiList: ['chooseWXPay', 'getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone',
      'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  })

  return res
}

/**
 * 初始化LeanCloud
 */
export function initLeanCloud() {
  // AV.setProduction(config.lean_stg);
  const APP_ID = config.lean_app_id;
  const APP_KEY = config.lean_app_key;
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  });
}


export let showErrPlugin = {
  name: 'showErrPlugin',
  install(Vue) {
    Vue.prototype.showErr = showErr
  }
}
export let goPrjPagePlugin = {
  name: 'goPrjPage',
  install(Vue) {
    Vue.prototype.goPrjPage = goPrjPage
  }
}
export let goPrjUrlPlugin = {
  name: 'goPrjUrl',
  install(Vue) {
    Vue.prototype.goPrjUrl = goPrjUrl
  }
}
export let showMsgPlugin = {
  name: 'showMsgPlugin',
  install(Vue) {
    Vue.prototype.showMsg = showMsg
  }
}

// 断网处理
export function Offline() {
  if (!window.Offline) {
    return
  }
  window.Offline.on('down', () => showErr('网络连接失败，请检查网络后重试'))
  window.Offline.on('up', () => showErr('网络连接成功'))
}


// 关闭初始loading
export function removeLoading() {
  let preloadEl = document.getElementById('preload')
  preloadEl.style.transition = 'all .5s ease'
  preloadEl.style.opacity = '0'
  setTimeout(() => {
    document.body.removeChild(preloadEl)
  }, 500)
}

// 进度条
var options = {
  classname: 'my-class',
  id: 'my-id',
  target: document.getElementById('myDivId')
}

// AVPlugin

export let AVPlugin = {
  name: 'AVPlugin',
  install(Vue) {
    Vue.prototype.AV = AV
  }
}

export function initNativeLogin() {
  var listener = function( sessionToken ) {

    // sessionToken && AV.User.become(sessionToken.token).then(function(user) {
    //   // currentUser 已更新
    // })
  }
  window.broadcaster && _.isFunction(window.broadcaster.addEventListener) && window.broadcaster.addEventListener( "NativeLogin", listener);
}

export function init(params) {
  
}