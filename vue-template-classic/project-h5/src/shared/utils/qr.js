/**
 * 扫描二维码
 * @param needResult 0||1 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
 * @param callback 回调函数
 */
import { config } from 'core/context';
export function scanQRCode(callback, needResult) {
  if (callback && typeof callback != 'function') {
    throw new Error('callback must be a function')
    return
  }
  if (config.project_build_type === 'wx' || config.project_build_type === 'mixapp') {
    window.wx.scanQRCode({
      needResult: needResult,
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: (res) => {
        callback(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
      }
    })
  } else if (config.project_build_type === 'app') {
    window.broadcaster && window.broadcaster.fireNativeEvent && window.broadcaster.fireNativeEvent("GET_CAMERA_PERMISSION", {})
    window.cordova.plugins.barcodeScanner.scan((res) => { callback(res.text) }, () => {
      throw new Error('')
    })
  }
}
