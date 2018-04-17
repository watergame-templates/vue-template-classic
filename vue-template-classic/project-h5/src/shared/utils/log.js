import Vue from 'vue'
import _ from 'lodash';
import AV from 'leancloud-storage'
import{ config, getStorage, setStorage } from 'core/context';

export function log() {}

export function showErr(err) {
  let msg = ''
  if (typeof err === 'string') {
    msg = err
  } else if (typeof err === 'undefined') {
    msg = 'error is undefined'
  } else {
    msg = JSON.stringify(err) + err.toString()
  }
  Vue.$vux.toast.show({
    type: 'text',
    text: msg,
    width: '70%',
    position: 'bottom'
  })
  Vue.$vux.loading.hide()
}

export function showMsg(err) {
  let msg = ''
  if (typeof err === 'string') {
    msg = err
  } else if (typeof err === 'undefined') {
    msg = 'error is undefined'
  } else {
    msg = JSON.stringify(err) + err.toString()
  }
  Vue.$vux.toast.show({
    type: 'text',
    text: msg,
    width: '70%',
    position: 'bottom'
  })
}

export function getSharelogFun(to, type) {

  var query = _.clone(to.query)
  var params = _.clone(to.params)
  let pagecode = to.path
  let currentPhone
  try {
    currentPhone = AV.User.current().toJSON().mobilePhoneNumber
  } catch (error) {
    currentPhone = '18888888888'
  }
  pagecode = config.prj + '/?#' + pagecode
  to.meta.sharelog && to.meta.sharelog.forEach(i => {
    if (to.query[i]) {
      pagecode = pagecode + `&${i}=${to.query[i]}`
    }
  })
  pagecode = pagecode.replace('&', '?')
  // type 1 记录分享者
  // type 2 记录打开者
  if (type === 2) {
      if (!AV.User.current()) {
        //未登录下保存分享信息 [
        //   {
        //     sharedby_userid: _.get(query, 'shareby', '18888888888'),
        //     pagecode
        //   }
        // ]
        let shareInfo = getStorage('shareInfo') || []
        if (shareInfo.some(i => {
          return i.sharedby_userid === _.get(query, 'shareby', '18888888888') && i.pagecode === pagecode
        })) {

        } else {
          shareInfo.push({
            sharedby_userid: _.get(query, 'shareby', '18888888888'),
            pagecode
          })
        }
        setStorage('shareInfo', shareInfo)
        return () => {}
      } else {
        // 获取配置信息
        async function updateShareLog( sharedby_userid, pagecode) {
          try {
            return AV.Cloud.run('base_sharelog_op', {
              opcode: 'WxClickService',
              current_userid: _.get(getStorage('wechatUserInfo'), 'openid', currentPhone),
              sharedby_userid,
              pagecode,
              devicetype: _.get(navigator, 'platform', ''),
              useragent: {
                "userAgent": _.get(navigator, 'userAgent', ''),
                "platform": _.get(navigator, 'platform', ''),
                "appCodeName": _.get(navigator, 'appCodeName', ''),
                "appMinorVersion": _.get(navigator, 'appMinorVersion', ''),
                "appVersion": _.get(navigator, 'appVersion', ''),
                "connection": _.get(navigator, 'connection', ''),
                "geolocation": _.get(navigator, 'geolocation', ''),
                "oscpu": _.get(navigator, 'oscpu', ''),
                "serviceWorker": _.get(navigator, 'serviceWorker', ''),
                "mimeTypes": _.get(navigator, 'mimeTypes', ''),
                "javaEnabled": _.get(navigator, 'javaEnabled', '')
              }
            })
          } catch (error) {
            console.log(error);
          }
        }
        let shareInfo = getStorage('shareInfo') || []
        return () => {
          if (_.get(query, 'shareby')) {
            updateShareLog(_.get(query, 'shareby', '18888888888'), pagecode )
          }
          let promisArr = shareInfo.map(i => {
            return updateShareLog(i.sharedby_userid, i.pagecode )
          })
          Promise.all(promisArr).then(data => {
            shareInfo.length = 0
            setStorage('shareInfo', shareInfo)
          }).catch((e) => {
            shareInfo.length = 0
            setStorage('shareInfo', shareInfo)
            console.log(e);
          })
        }
      }
      
  } else if (type === 1) {

    return () => {
      try {
        AV.Cloud.run('base_sharelog_op', {
          opcode: 'WxShareService',
          userid: _.get(getStorage('wechatUserInfo'), 'openid', currentPhone),
          pagecode
        })
      } catch (e) {
        console.log(e);
      }
    }
  }
}
