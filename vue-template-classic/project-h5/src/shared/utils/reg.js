/**
     * 校验手机号
     * @param phoneNum
     */
export function checkPhoneNum(phoneNum) {
  let isPhoneNum = false;
  if (phoneNum) {
    var reg = /^1[34578]\d{9}$/;
    isPhoneNum = reg.test(phoneNum);
  }
  return isPhoneNum;
}
export function firstUpperCase(str) {
  if (str === undefined || str === null) {
    return ''
  } else if (typeof str === 'string') {
    return str[0].toUpperCase() + str.slice(1);
  } else {
    console.error('firstUpperCase param is string')
  }
}