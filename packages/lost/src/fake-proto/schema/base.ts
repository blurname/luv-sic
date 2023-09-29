type Bound = {
  x: number
  y: number
  w: number
  h: number
}

type Props = Bound

abstract class EBase {
  type: string
  x: number
  y: number
  w: number
  h: number

  constructor (props:Props) {
    this.type = 'eBase'
    this.x = props.x
    this.y = props.y
    this.w = props.w
    this.h = props.h
  }

  domRender = ():React.JSX.Element | null => {
    return null
  }

  canvasRender = (ctx:CanvasRenderingContext2D) => {
    ctx.fill()
  }
}

export type {
  Bound
}
export {
  EBase
}
