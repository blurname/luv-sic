export type CreateDraggableOptions = {
  onStart(x: number, y: number): void;
  onMove(x: number, y: number): void;
  onEnd(x: number, y: number): void;
};

export const createDragable = (
  elem: HTMLElement,
  options: CreateDraggableOptions
) => {
  const handleMouseDown = (event: MouseEvent) => {
    const handleMouseMove = (event: MouseEvent) => {
      options.onMove(event.pageX, event.pageY)
    }

    const handleMouseUp = (event: MouseEvent) => {
      options.onEnd(event.pageX, event.pageY)
      document.removeEventListener('mousemove', handleMouseMove, false)
      document.removeEventListener('mouseup', handleMouseUp, false)
    }

    document.addEventListener('mousemove', handleMouseMove, false)
    document.addEventListener('mouseup', handleMouseUp, false)

    options.onStart(event.pageX, event.pageY)
  }

  const handleTouchStart = (event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault()
    }
    const touchEvent = event.touches[0]
    // fix: touchend event may not have touches
    let latestTouch: Touch | null = null

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]

      latestTouch = touch
      options.onMove(touch.pageX, touch.pageY)
    }

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.touches[0] ?? latestTouch

      document.removeEventListener('touchmove', handleTouchMove, false)
      document.removeEventListener('touchend', handleTouchEnd, false)

      options.onEnd(touch?.pageX ?? 0, touch?.pageY ?? 0)
    }

    document.addEventListener('touchmove', handleTouchMove, false)
    document.addEventListener('touchend', handleTouchEnd, false)

    options.onStart(touchEvent.pageX, touchEvent.pageY)
  }

  const listen = () => {
    elem.addEventListener('mousedown', handleMouseDown, false)
    elem.addEventListener('touchstart', handleTouchStart, false)
  }

  const unlisten = () => {
    elem.removeEventListener('mousedown', handleMouseDown, false)
    elem.removeEventListener('touchstart', handleTouchStart, false)
  }

  return {
    listen,
    unlisten
  }
}
