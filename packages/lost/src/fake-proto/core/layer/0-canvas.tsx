import React, { useRef, useEffect, useState } from 'react'

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!
    const container = containerRef.current!

    // 设置画布初始尺寸
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    const draw = () => {
      // 清空画布
      context.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制内容

      // 偏移画布
      context.translate(offsetX, offsetY)

      // 绘制内容

      // 恢复画布偏移
      context.translate(-offsetX, -offsetY)
    }

    const handleScroll = (event) => {
      // 根据滚动方向更新偏移量
      if (event.deltaY < 0) {
        setOffsetY((prevOffsetY) => prevOffsetY + 100)
      } else {
        setOffsetY((prevOffsetY) => prevOffsetY - 100)
      }
    }

    // 监听滚动事件
    container.addEventListener('wheel', handleScroll)

    // 初始绘制画布
    draw()

    return () => {
      // 移除滚动事件监听器
      container.removeEventListener('wheel', handleScroll)
    }
  }, [offsetX, offsetY])

  return (
      <div style={{ overflow: 'scroll', width: '100%', height: '100%' }} ref={containerRef}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  )
}

export {
  Canvas
}
