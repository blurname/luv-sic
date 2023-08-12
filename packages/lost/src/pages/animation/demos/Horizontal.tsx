import React, { useEffect, useMemo, useRef } from 'react'
import { useColorList } from '../hooks/useColorList/index.js'
import { StaticMovableList } from '../rxjs-animation/MovableList.js'
import { createDragable } from '../rxjs-animation/DOM.js'

export function HorizontalDemo () {
  const containerRef = useRef<HTMLDivElement>(null)

  const [colorList, _] = useColorList(12)

  const widthList = useMemo(() => {
    return colorList.map(() => Math.floor(50 + 50 * Math.random()))
  }, [colorList])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const keyList = widthList.map((_, index) => index.toString())

    const offset = {
      x: containerRect.x,
      y: containerRect.y
    }

    const movableList = StaticMovableList({
      mode: 'Horizontal',
      widthList,
      keyList,
      offset,
      spacing: 5
    })

    const subscription = movableList.state$.subscribe((list) => {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const child = container.children[Number(item.key)] as HTMLDivElement
        if (item.info.isMoving) {
          child.style.zIndex = '3'
        } else if (item.info.isAnimating) {
          child.style.zIndex = '2'
        } else {
          child.style.zIndex = '1'
        }
        child.style.display = ''
        child.style.transform = `translate3d(${item.info.position.x}px, 0, 0)`
      }
    })

    const handlers: ReturnType<typeof createDragable>[] = []

    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i] as HTMLDivElement
      const key = i.toString()
      const handler = createDragable(child, {
        onStart (x, y) {
          movableList.actions.start(key, x, y)
        },
        onMove (x, y) {
          movableList.actions.move(key, x, y)
        },
        onEnd (x, y) {
          movableList.actions.end(key, x, y)
        }
      })
      handler.listen()
      handlers.push(handler)
    }

    return () => {
      subscription.unsubscribe()
      handlers.forEach((handler) => handler.unlisten())
    }
  }, [colorList, widthList, containerRef])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {colorList.map((color, index) => {
        const width = widthList[index]
        const style: React.CSSProperties = {
          display: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height: 400,
          lineHeight: `${400}px`,
          textAlign: 'center',
          color: 'white',
          background: color,
          userSelect: 'none'
        }
        return (
          <div key={index} style={style}>
            {index}
          </div>
        )
      })}
    </div>
  )
}
