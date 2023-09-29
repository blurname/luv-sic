import React from 'react'
import { Bound, EBase } from './base.js'

const drawRectangle = (ctx: CanvasRenderingContext2D, bound:Bound) => {
  ctx.rect(
    bound.x,
    bound.y,
    bound.w,
    bound.h
  )
}

type Props = Bound
class ERect extends EBase {
  constructor (props:Props) {
    super(props)
    this.type = 'eRect'
  }

  domRender = () => {
    return <div>rect</div>
  }

  canvasRender = (ctx:CanvasRenderingContext2D) => {
    drawRectangle(ctx, this)
  }
}

export {
  ERect
}
