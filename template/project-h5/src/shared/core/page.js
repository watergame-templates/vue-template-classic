import { setSessionStorage, config, baseURL } from 'core/context';
export function goPrjPage(prj, path = '/') {
  setSessionStorage('jumpPage', {
    'from': config.prj,
    'to': prj
  })
  if (prj) {
    if (process.env.NODE_ENV === 'development') {
      return window.location.href = baseURL + prj + '/?#' + path
    }
    if (process.env.PROJECT_BUILD_TYPE !== 'app') {
    console.log('../' + prj + '/index.html#' + path);
      
      return window.location.href = '../' + prj + '/?#' + path
    }
    return window.location.href = '../' + prj + '/index.html#' + path
  } else {
    if (/^http/i.test(path)) {
      if (process.env.NODE_ENV === 'development') {
        return window.location.href = path
      }
      if (process.env.PROJECT_BUILD_TYPE !== 'app') {
        return window.location.href = path
      }
      return window.cordova.InAppBrowser.open(path, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
    }
  }

}
export function goPrjUrl(prj, path = '/') {
  if (process.env.NODE_ENV === 'development') {
    return baseURL + prj + '/?#' + path
  }
  if (process.env.PROJECT_BUILD_TYPE !== 'app') {
    return '../' + prj + '/?#' + path
  }
  return '../' + prj + '/index.html#' + path
}