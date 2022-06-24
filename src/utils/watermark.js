'use strict'

let watermark = {}

let setWatermark = (str) => {
  let id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')
  can.width = 400
  can.height = 200

  let cans = can.getContext('2d')
  cans.font = '20px Microsoft JhengHei'
  cans.fillStyle = 'rgba(200, 200, 200, 0.25)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 3, can.height / 2)

  let div = document.createElement('div')
  div.style.pointerEvents = 'none'
  div.style.width = document.documentElement.clientWidth - 100 + 'px'
  div.style.height = document.documentElement.clientHeight - 100 + 'px'
  div.style.transform = 'rotate(-12deg)'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'

  let divCont = document.createElement('div');
  divCont.id = id
  divCont.style.pointerEvents = 'none'
  divCont.style.top = '70px'
  divCont.style.left = '200px'
  divCont.style.position = 'fixed'
  divCont.style.zIndex = '100000'
  divCont.style.overflow = 'hidden'
  divCont.style.width = document.documentElement.clientWidth - 100 + 'px'
  divCont.style.height = document.documentElement.clientHeight - 100 + 'px'

  divCont.appendChild(div)
  document.body.appendChild(divCont)
  return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

export default watermark
