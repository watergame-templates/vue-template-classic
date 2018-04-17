/**
 * 接口汇总
 * @type {string}
 */
import config_g from './config.g.json';
import keep_alive_list from './keep_alive_list.g.json'
// 生产环境
// let baseURL = 'http://lz.lzhealth.com.cn/api/';
// 测试环境
//    let baseURL = 'http://lz.lianzhongtongxing.cn/api/';
export const baseURL = `http://${config_g.lean_url}/`;
// let baseURL = 'http://oscar-zhangzs.c9users.io:8081/api/';
// let baseURL = 'http://lz.lianzhongtongxing.cn:8001/api/';
// let baseURL = 'http://oscar-lz-zhangzs.c9users.io:8081/api/';
// 本地测试
// let baseURL = 'http://lz.liugh.xyz/api/';
// 生产环境：PRODUCTION 开发环境：DEVELOP 预备环境：STAGING


let interfaceUrl = {
    // 经纬度转详细位置 坐标的类型，目前支持的坐标类型包括：bd09ll（百度经纬度坐标）、bd09mc（百度米制坐标）、gcj02ll（国测局经纬度坐标）、wgs84ll（ GPS经纬度）
    getLoactionDetail: 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=Ps1WFD32jFFIIDwGvTDmTjVwW6IEYHCG&coordtype=wgs84ll',
    // 获取微信OpenId AccessToken
    getWechatUserInfo: `${baseURL}wx_get_user_info/`,
    // 微信SDK初始化
    getWechatConfig: `${baseURL}wx_get_wechat_config/`,
    // 微信统一下单
    wechatUnifiedOrder: `${baseURL}wx_unified_order`,
    // 支付宝统一下单
    alipayUnifiedOrder: `${baseURL}alipay_unified_order`,
    // 获取带参数二维码
    getQRCode: `${baseURL}wx_get_qr_code`,
    getWechatUserInfoForScan: `${baseURL}wx_get_user_info_for_scan`,
    // 聚合数据 身份证验证
    identification: 'http://apis.juhe.cn/idcard/index',
    // 联图网二维码生成
    getQRCodeImg: 'http://qr.liantu.com/api.php'
};
export let app = {
    url: interfaceUrl
};
export let config = Object.assign(config_g, {
    project_build_type: process.env.PROJECT_BUILD_TYPE
})
export let keepalivelist = keep_alive_list