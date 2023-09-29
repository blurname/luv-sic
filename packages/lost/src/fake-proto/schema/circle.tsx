import React from 'react'
import { Bound, EBase } from './base.js'

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  { x, y, w, h }:Bound
) => {
  const width = w + 40
  const height = h
  const radius = 0.1
  const cornerRadius = Math.min(width * radius, height * radius)
  ctx.moveTo(x + cornerRadius, y)
  ctx.arcTo(x + width, y, x + width, y + height, cornerRadius)
  ctx.arcTo(x + width, y + height, x, y + height, cornerRadius)
  ctx.arcTo(x, y + height, x, y, cornerRadius)
  ctx.arcTo(x, y, x + width, y, cornerRadius)
}

type Props = Bound
class ECircle extends EBase {
  constructor (props:Props) {
    super(props)
    this.type = 'eTriangle'
  }

  domRender = () => {
    return <div>rect</div>
  }

  canvasRender = (ctx:CanvasRenderingContext2D) => {
    drawCircle(ctx, this)
  }
}

export {
  ECircle
}
