// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import AV from 'leancloud-storage'
import Router from 'vue-router'
import { ConfirmPlugin , ToastPlugin, Loading,LoadingPlugin, DatetimePlugin, WechatPlugin, querystring, AlertPlugin   } from 'vux'
import axios from 'axios'
import _ from 'lodash'
import VueLazyload from 'vue-lazyload'
import "babel-polyfill";

import App from './App'
import router from './router/router.ex.js'
import { IPC, goPayment, initNativeLogin, getSharelogFun, formatArray, getQueryString, format, setStorage, config, showErr, showErrPlugin, goPrjPagePlugin, goPrjUrlPlugin, showMsg, showMsgPlugin, removeLoading, processStart, processEnd, AVPlugin, initLeanCloud, initWechatSDK, getCurrentUser, http, rem, getStorage, app } from 'core/context'
if (config.project_build_type === 'app') {
  window.AV = AV
}

Vue.use(Router)
Vue.use(ToastPlugin)
Vue.use(DatetimePlugin)
Vue.use(WechatPlugin)
Vue.use(showErrPlugin)
Vue.use(showMsgPlugin)
Vue.use(goPrjPagePlugin)
Vue.use(goPrjUrlPlugin)
Vue.use(AVPlugin)
Vue.use(VueLazyload)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
let wx = Vue.wechat
Vue.prototype.IPC = IPC
Vue.prototype.goPayment = goPayment

// error的Toast
Vue.use(http, {
  showError: showErr,
  requestUse: [
    // some_callback
  ]
})
// Vue.use(Loading)
Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: '',
	loading: require('../static/img/loading.gif'),
	attempt: 1
})

Vue.config.productionTip = false
initLeanCloud()

// 消除点击延迟
// FastClick.attach(document.body)

// 监听原生登录
if (config.project_build_type === 'app') {
  window.addEventListener('load', function () {
    window.broadcaster && _.isFunction(window.broadcaster.fireNativeEvent) && window.broadcaster.fireNativeEvent( "domLoad", { item:'domLoad' }, function() {
      console.log( "event fired!" );
      })
  })
  initNativeLogin()
}

// rem适配
rem()
// removeLoading()

router.afterEach((to, from) => {
  // processEnd()
  if (_.isArray(to.meta.sharelog)) {
    if (to.query.shareby) {
      getSharelogFun(to, 2)()
    }
  }
})

// 路由改变时重新初始化微信SDK 否则会导致签名失败
// if (config.project_build_type === 'wx') {
//   initWechatSDK(wx);
// }

router.beforeEach(async (to, from, next) => {
  // processStart()
  //如果设置标题，拦截后设置标题
  // #的原因，微信分享后的路由重新解析
  //http://localhost:8081/?from=singlemessage&isappinstalled=0#/activitypage/views/activitypage_wheel_v4?shareby=18888888888
  let reg = /(\S+)\?([^\#]+)(\#\S+)/
  let href = window.location.href

  // 通知app 更新 title
  let title_p = {
    title : to.meta.pageName,
    goBack: to.meta.goBack ? to.meta.goBack : -1
  }
  IPC('IPC_updateTitle', title_p)

  if (reg.test(href)) {
    window.location.href = href.replace(reg, function (match, $1, $2, $3) {
      if (($1 + $3).indexOf('?') > 0) {
        return $1 + $3 + '&' + $2
      } else {
        return $1 + $3 + '?' + $2
      }
    })
  } else {

    // 刚从微信过来时路由转换，根据routepath
    if (getQueryString('routepath', to.fullPath)) {
      let routePath = getQueryString('routepath', to.fullPath) ? getQueryString('routepath', to.fullPath).replace(/--/g, '/') : '';
      let query = {};
      let paramList = routePath.split('__').filter((item, index) => index !== 0);
      paramList.forEach((item, index) => {
        let key = item.split('=')[0];
        let val = item.split('=')[1];
        query[key] = val;
      });
      if (getQueryString('code')) {
        query['code'] = getQueryString('code');
      }
      routePath ? router.replace({ path: routePath.split('__')[0], query: query }) : '';
    }
    // 校验登录状态 未跳转到登录页面
    // 
    if (to.matched.some(record => (record.meta.wxLogin))) {
      // 跳过开发者模式
      if (process.env.NODE_ENV === 'development') {
        return chakePhone()
      }
      if (config.project_build_type !== 'wx') {
        return chakePhone()
      }
      // 获取openid
      let openid
      let wechatUserInfo = getStorage('wechatUserInfo')
      if (typeof getStorage('wechatUserInfo') !== 'object') {
        openid = null
      } else {
        if (_.get(wechatUserInfo, 'openid')) {
          openid = wechatUserInfo.openid
        } else {
          openid = null
        }
      }
      let code = getQueryString('code')
      // 无登陆时跳微信登陆页
      if (!openid && !code) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wx_app_id_pub +'&redirect_uri=' +
          format(to)
          + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
          return
      } else if (code && !openid) {
        // 跳回来时有code路由已经经过转换
        // 获取openid
        let res
        try {
          res = await axios.get(app.url.getWechatUserInfo, { params: { code: code } });
        } catch (error) {
          console.log(`err
              ${error}
            `)
        }
        if (!res.errcode) {
          setStorage('wechatUserInfo', res.data);
         
          // 按微信注册
          try {
            await AV.User.signUpOrlogInWithAuthData({
              "openid": res.data.openid,
              "access_token": res.data.accessToken,
              "expires_at": new Date()
            }, 'weixin');
            getSharelogFun(to, 2)()
          } catch (e) {
            console.error(e);
          }
        } else {
          console.log(`
          res.errcode
          ${res.errcode}
          `)
        }
      } else if (openid) {
        return chakePhone()
      }
    }
    return chakePhone()
    function chakePhone() {
      let test = false
      if (to.matched.some(record => (record.meta.wxLogin)) && config.project_build_type !== 'wx') {
        test = true
      }
      if (to.matched.some(record => (record.meta.phoneLogin))) {
        test = true
      }
      if (test) {
        let user = getCurrentUser()
        let mobilePhoneVerified = _.get(user, 'attributes.mobilePhoneVerified')
        console.log(to)
        if (!mobilePhoneVerified) {
          // window.sessionStorage.setItem('linkToPath', to.fullPath)
          next({ name: 'login_common', query: { linkToPath: to.fullPath, ...from.query } })
          
        } else {
          next()
        }
      } else {
        next()
      }
    }
  }

});

// 当懒加载时未加载成功的函数
router.onError((err) => {
  console.error(err)
  console.log(`
  routeerr
  ${JSON.stringify(err)}
  `)
  showErr('网络异常')
})

// window.addEventListener("load", Offline)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  directives: {
    scroll: {
      bind: function (el, binding){
      window.addEventListener('scroll', ()=> {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        console.log('document.documentElement.scrollTop',scrollTop);
        console.log('window.innerHeight',window.innerHeight);
        console.log('el.clientHeight',el.clientHeight);
        if(scrollTop + window.innerHeight >= el.clientHeight / 2) {
          showMsg(document.body);
          showMsg(document.documentElement);
        }
      })
      }
    }
  }
})

// 方法函数
if (process.env.DEBUG) {
  window.addEventListener('load', function () {
    let count = 0
    let clickArr = []
    document.addEventListener('click', function () {
      let n = Number(new Date())
      if (clickArr.length) {
        if (n - clickArr[clickArr.length - 1] > 300) {
          clickArr.length = 0
          clickArr.push(n)
        } else {
          clickArr.push(n)
        }
        if (clickArr.length >= 8) {
          window.vConsole.showSwitch()
          clickArr.length = 0
        }
      } else {
        clickArr.push(n)
      }
    })
  })
}
