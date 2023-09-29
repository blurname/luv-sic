import React from 'react'
import { Bound, EBase } from './base.js'

const drawTriangle = (ctx: CanvasRenderingContext2D, { x, y, w, h }:Bound) => {
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x, y + h)
  ctx.lineTo(x + w, y + h)
}

type Props = Bound
class ETriangle extends EBase {
  constructor (props:Props) {
    super(props)
    this.type = 'eTriangle'
  }

  domRender = () => {
    return <div>rect</div>
  }

  canvasRender = (ctx:CanvasRenderingContext2D) => {
    drawTriangle(ctx, this)
  }
}

export {
  ETriangle
}
