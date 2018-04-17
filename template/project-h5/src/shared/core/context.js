/**
 * Created by tangyueyang on 2017/5/5.
 */
/* eslint-disable */
import AV from 'leancloud-storage'
import axios from 'axios'
import * as exception from './exception'
import * as privateUtils from './utils.ex.js'
import * as file from './file'
import * as init from './init'
import * as str from './str'
import * as page from './page'
import * as config from 'utils/config'
import * as constants from 'utils/constants'
import * as date from 'utils/date'
import * as dom from 'utils/dom'
import * as geo from 'utils/geo'
import * as http from 'utils/http'
import * as log from 'utils/log'
import * as qr from 'utils/qr'
import * as reg from 'utils/reg'
import * as sms from 'utils/sms'
import * as storage from 'utils/storage'

export * from './exception'
export * from './page'
export * from './file'
export * from './init'
export * from './utils.ex.js'
export * from './str'
export * from 'utils/config'
export * from 'utils/constants'
export * from 'utils/date'
export * from 'utils/dom'
export * from 'utils/geo'
export * from 'utils/http'
export * from 'utils/log'
export * from 'utils/qr'
export * from 'utils/reg'
export * from 'utils/sms'
export * from 'utils/storage'

export default {
  getCurrentUser,
  getIsStg,
  getUIConfigJson,
  IPC,
  ...exception,
  ...file,
  ...init,
  ...str,
  ...config,
  ...constants,
  ...date,
  ...date,
  ...dom,
  ...geo,
  ...http,
  ...log,
  ...qr,
  ...reg,
  ...sms,
  ...storage,
  ...privateUtils,
  ...page
}


export function getIsStg() {
  return config.config || true
}
export function getCurrentUser() {
  return AV.User.current();
}

export async function getUIConfigJson(prj, code) {
  let list = [
    'cx_home_goddess',
    'ec_home_ecv4',
    'gj_home_index',
    'lz_home_gj'
  ]
  if (list.includes(code)) {
    if (process.env.NODE_ENV === 'development') {
      let result = await axios.get(`/meta/wx/${prj}/${code.split('_')[1]}/${code.replace(prj + '_', '')}.metaui.g.json`)
      return result.data
    } else {
      let query = new AV.Query('BASE_Setting')
      query.equalTo('prj', prj)
      query.equalTo('code', code)
      query.descending("createdAt")
      let result = await query.first()
      return result.toJSON().obj
    }
  } else {
    return {}
  }
  
}

// 处理url
export function replaceImgUrl(uiJ, prj, dir) {
  for (let key in uiJ) {
    if (key.startsWith('img_') && !uiJ[key].startsWith('http') && !uiJ[key].startsWith('/meta')) {
      if (process.env.NODE_ENV === 'development') {
        uiJ[key] = `/meta/wx/${prj}/${dir}/img/${uiJ[key]}`
      } else {
        uiJ[key] = `${config.baseURL}meta/wx/${prj}/${dir}/img/${uiJ[key]}`
      }
      continue
    }
    if (Array.isArray(uiJ[key])) {
      for (let val of uiJ[key]) {
        // console.log(typeof uiJ[key] === 'object' && !Array.isArray(uiJ[key]))
        if (typeof val === 'object' && !Array.isArray(val)) {
          // console.log(val)
          replaceImgUrl(val, prj, dir)
        }
      }
    }
    if (typeof uiJ[key] === 'object' && !Array.isArray(uiJ[key])) {
      replaceImgUrl(uiJ[key], prj, dir)
    }
  }
}

// 与原生交互
export function IPC(funName, payload = {}) {
  if (process.env.PROJECT_BUILD_TYPE === 'mixapp') {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    if (isAndroid) {
      try {
        window.IPC[funName](JSON.stringify(payload))
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        window.webkit.messageHandlers[funName].postMessage(payload)
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export async function goPayment(className, orderId) {
  if (process.env.PROJECT_BUILD_TYPE === 'mixapp') {
    let queryOrder = new AV.Query(className)
        .equalTo('objectId', orderId)
    let order = await queryOrder.first()
    // console.log(order);
    let orderInfo = order.toJSON()
    let payId
    let paymentInfo
    let lastPrj = className.split('_')[0].toLowerCase()
    if (order.get('paymentOrder')) {
      // 如果存在paymentOrder
      payId = order.get('paymentOrder').id || orderInfo.paymentOrder.objectId
      paymentInfo = await new AV.Query('BASE_Payment').get(payId)
      console.log('paymentInfo', paymentInfo);
    } else {
      // 如果不存在paymentOrder， 新建一条并回写paymentOrder字段
      
      let payment = new AV.Object.createWithoutData('BASE_Payment');
      payment.set('orderno', orderInfo.orderno)
      payment.set('sourceEntity', className)
      payment.set('sourceEntityID', order.id)
      payment.set('sourceEntitySuccessedOperation', className.toLowerCase() + '_op')
      payment.set('type', 3)
      payment.set('prj', lastPrj)
      let res = await payment.save()
      payId = res.id
      let currentOrder = new AV.Object.createWithoutData(className, orderId);
      currentOrder.set('paymentOrder', res)
      await currentOrder.save()
    }
    IPC('IPC_goPayment', {
      className,
      orderId,
      payId
    })
  } else {
    page.goPrjPage('base', `payment/views/payment_index?className=${className}&objectId=${orderId}`)
  }
}