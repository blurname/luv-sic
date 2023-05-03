import React, { useEffect, useMemo, useRef } from 'react'
import { useColorList } from '../hooks/useColorList'
import { MovableInfo } from '../rxjs-animation/Movable'
import { StaticMovableList, Rect, Size } from '../rxjs-animation/MovableList'
import { createDragable } from '../rxjs-animation/DOM'

const renderRect = (
  ctx: CanvasRenderingContext2D,
  color: string,
  rect: Rect
) => {
  ctx.fillStyle = color
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}

export function CanvasDemo () {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [colorList, setColorList] = useColorList(100)

  const size = useMemo(() => {
    return {
      width: Math.floor(50 + 50 * Math.random()),
      height: Math.floor(50 + 50 * Math.random())
    }
  }, [colorList])

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const containerRect = container.getBoundingClientRect()
    const keyList = colorList.map((_, index) => index.toString())

    if (!ctx) return

    const offset = {
      x: containerRect.x,
      y: containerRect.y
    }

    const movableList = StaticMovableList({
      mode: 'Grid',
      width: size.width,
      height: size.height,
      columnCount: 10,
      keyList,
      offset,
      animation: {
        disable: false
      },
      margin: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
      }
    })

    type Item = {
      info: MovableInfo;
      key: string;
      size: Size;
    };

    const renderItem = (item: Item) => {
      if (!ctx) return
      const rect: Rect = {
        width: item.size.width,
        height: item.size.height,
        x: item.info.position.x,
        y: item.info.position.y
      }
      renderRect(ctx, colorList[Number(item.key)], rect)
    }

    const subscription = movableList.state$.subscribe((list) => {
      let movingItem: Item | null = null

      const animatingItems: Item[] = []

      ctx?.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < list.length; i++) {
        const item = list[i]

        if (item.info.isMoving) {
          movingItem = item
        } else if (item.info.isAnimating) {
          animatingItems.push(item)
        } else if (ctx) {
          renderItem(item)
        }
      }

      for (let i = 0; i < animatingItems.length; i++) {
        renderItem(animatingItems[i])
      }

      if (movingItem && ctx) {
        renderItem(movingItem)
      }
    })

    let currentKey = ''

    const handler = createDragable(canvas, {
      onStart (x, y) {
        const activeInfo = movableList.actions.getActiveInfo(x, y)
        if (!activeInfo) return
        currentKey = activeInfo.key
        movableList.actions.start(currentKey, x, y)
      },
      onMove (x, y) {
        movableList.actions.move(currentKey, x, y)
      },
      onEnd (x, y) {
        movableList.actions.end(currentKey, x, y)
      }
    })

    handler.listen()

    return () => {
      subscription.unsubscribe()
      handler.unlisten()
    }
  }, [colorList, size, containerRef])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 100}
      />
    </div>
  )
}
