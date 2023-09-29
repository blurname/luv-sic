import React from 'react'
import { Bound, EBase } from './base.js'

type Props = Bound
class EImage extends EBase {
  imageUrl: string
  constructor (props:Props) {
    super(props)
    this.type = 'eImage'
    this.imageUrl = 'asdf'
  }

  domRender = () => {
    return <img src={this.imageUrl}></img>
  }

  canvasRender = (ctx:CanvasRenderingContext2D) => {
    const img = new Image()
    img.src = this.imageUrl

    ctx.drawImage(img, 0, 0)
  }
}

export {
  EImage
}
