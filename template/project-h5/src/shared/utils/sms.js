import AV from 'leancloud-storage';
/**
 * 三方登录
 * @example
 * 微博（weibo）用 uid
 * 微信（weixin）和 QQ（qq）用 openid
 * {
 * "openid": "oPrJ7uM5Y5oeypd0fyqQcKCaRv3o",
 * "access_token": "OezXcEiiBSKSxW0eoylIeNFI3H7HsmxM7dUj1dGRl2dXJOeIIwD4RTW7Iy2IfJePh6jj7OIs1GwzG1zPn7XY_xYdFYvISeusn4zfU06NiA1_yhzhjc408edspwRpuFSqtYk0rrfJAcZgGBWGRp7wmA",
 * "expires_at": "2016-01-06T11:43:11.904Z"
 * }
 * @param data
 * @param type weixin||weibo||qq
 */

export function authoLogin(data, type) {
  return AV.User.signUpOrlogInWithAuthData(data, type);
}

/**
 * 发送验证码
 * @param tel
 */
export function sendSms(tel) {
  return AV.Cloud.requestSmsCode(tel)
}