export function format(p) {
  let a1 = window.location.href.split('#')
  let origin = a1[0]
  let path = p.path.replace(/\//g, '--')
  let querypath = ''
  for (let key in p.query) {
    querypath += `__${key}=${p.query[key]}`
  }

  // 组装路径
  return `${origin}?routepath=${path}${querypath}`
}

/**
   * 获取url参数
   * @param name
   * @returns {null}
   * @constructor
   */
export function getQueryString(name, path = window.location.href) {
    var reg = new RegExp('(\\W)' + name + '=([^&]*)(&|\\b)');
    var r = path.match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
  