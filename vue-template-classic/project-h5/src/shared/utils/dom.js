// dom操作函数
const isDOMEL = (el) => (el instanceof HTMLElement)

export function triggerClick(el, childCls, triggerCls) {
  el.addEventListener('click', function (e) {
    let child = el.querySelector('.' + childCls)
    if (child) {
      setTimeout(() => {
        let trigger = document.querySelector('.' + triggerCls)
        trigger && trigger.click()
      }, 1000 / 60)
    }
  }, true)
}

export function addEvent(el, type, listener, useCapture) {
  if (el.addEventListener) {
    el.addEventListener(type, listener, useCapture)
  } else if (el.attachEvent) {
    el.attachEvent(`on${type}`, listener)
  } else {
    el[`on${type}`] = listener
  }
}

export function removeEvent(el, type, listener, useCapture) {
  if (el.removeEventListener) {
    el.removeEventListener(type, listener, useCapture)
  } else if (el.detachEvent) {
    el.detachEvent(`on${type}`, listener)
  } else {
    el[`on${type}`] = null
  }
}

export function hasClass(el, cls) {
  if (!isDOMEL(el)) return
  return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

export function addClass(el, cls) {
  if (!isDOMEL(el)) return
  if (el.classList) {
    el.classList.add(cls)
  } else {
    if (!hasClass(el, cls)) el.className += ` ${cls}`
  }
}

export function removeClass(el, cls) {
  if (!isDOMEL(el)) return
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    if (hasClass(el, cls)) {
      let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      el.className = el.className.replace(reg, ' ')
    }
  }
}

/**
 * [uploadFile 获取图片file&&base64]
 * @param  {[element]} img     [要设置图片target节点]
 * @param  {[function]} excute     [回掉]
 * @return {[type]}         [description]
 */
export function getImgFile(img, excute) {
  if (!img) {
    console.log('参数为空');
    return;
  }
  if (typeof (excute) !== 'function') {
    console.log('回调方法类型错误');
    return;
  }
  let imgFile, element;
  // let img = document.createElement('img');
  if (!imgFile) {
    imgFile = new FileReader();
  }
  if (!element) {
    element = document.createElement('input');
    element.type = 'file';
  }
  element.click();
  element.onchange = (event) => {
    imgFile.readAsDataURL(element.files[0]);
    imgFile.onload = function () {
      // this.result为base64数据
      img.src = this.result;
      excute(this.result, element.files[0]);
    };
  };
}

let timer = null

const handler = () => {
  const docEl = document.documentElement
  const clientWidth = docEl.clientWidth
  if (!clientWidth) return
  if (clientWidth > 420) {
    docEl.style.fontSize = 200 * (420 / 750) + 'px'
  } else {
    docEl.style.fontSize = 200 * (clientWidth / 750) + 'px'
  }
}

const ready = (e) => {
  const ev = 'orientationchange' in window ? 'orientationchange' : 'resize'
  window.addEventListener(ev, () => {
    clearTimeout(timer)
    timer = setTimeout(handler, 300)
  })
  handler()
}

export function rem() {
  document.addEventListener('DOMContentLoaded', ready)
}

export function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

export function getBackingStorePixelRatio(ctx) {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  )
}

export function ctxDownload(canvas, filename) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 图片转base64地址
  let imgType
  if (filename.endsWith('.png')) {
    imgType = 'image/png'
  } else {
    imgType = 'image/jpeg'
  }
  eleLink.href = canvas.toDataURL('image/jpeg');
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};