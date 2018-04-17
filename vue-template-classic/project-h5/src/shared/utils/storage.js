/* eslint-disable */
/**
 * 设置缓存
 * @param key
 * @param value
 */
export function setStorage(key, value) {
  if (!key || !value) {
    console.log('setStorage参数为空');
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}
/**
 * session设置缓存
 * @param key
 * @param value
 */
export function setSessionStorage(key, value) {
  if (!key || !value) {
    console.log('setStorage参数为空');
    return;
  }
  window.sessionStorage.setItem(key, JSON.stringify(value));
}
/**
 * 获取缓存
 * @param key
 */
export function getStorage(key) {
  if (!key) {
    console.log('getStorage参数为空');
  }
  if (!window.localStorage.getItem(key)) {
    return window.localStorage.getItem(key);
  } else {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (error) {
      return window.localStorage.getItem(key);
    }
  }
}
/**
 * 获取session缓存
 * @param key
 */
export function getSessionStorage(key) {
  if (!key) {
    console.log('getStorage参数为空');
  }
  if (!window.sessionStorage.getItem(key)) {
    return window.sessionStorage.getItem(key);
  } else {
    try {
      return JSON.parse(window.sessionStorage.getItem(key));
    } catch (error) {
      return window.sessionStorage.getItem(key);
    }
  }
}
/**
 * 移除缓存
 * @param key
 */
export function removeStorage(key) {
  if (!key) {
    console.log('removeStorage参数为空');
  }
  window.localStorage.removeItem(key);
}

/**
 * 两个参数，一个是cookie的名子，一个是值
 * @param name
 * @param value
 * @constructor
 */
export function setCookie(name, value) {
  var Days = 30; // 此 cookie 将被保存 30 天
  var exp = new Date(); // new Date("December 31, 9998");
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}

/**
 * 取cookies函数
 * @param name
 * @returns {null}
 */
export function getCookie(name) {
  var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
  if (arr != null) return unescape(arr[2]);
  return null;
}

/**
 * 删除cookie
 * @param name
 */
export function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
}
