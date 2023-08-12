import { combineLatest } from 'rxjs'
import { map, tap, publish, refCount } from 'rxjs/operators'
import { Movable, MovablePosition, MovableInfo, EasingType } from './Movable.js'

export type Rect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type LayoutFn = (sizeList: Size[]) => Rect[];

export type Margin = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type AnimationOptions = {
  disable?: boolean;
  duration?: number;
  easing?: EasingType;
};

export type Offset = {
  x: number;
  y: number;
};

export type StaticMovableListOptions =
  | {
      mode: 'Horizontal';
      widthList: number[];
      keyList: string[];
      spacing?: number;
      offset?: Offset;
      animation?: AnimationOptions;
      useExchanged?: boolean;
    }
  | {
      mode: 'Vertical';
      heightList: number[];
      keyList: string[];
      offset?: Offset;
      spacing?: number;
      animation?: AnimationOptions;
      useExchanged?: boolean;
    }
  | {
      mode: 'Grid';
      width: number;
      height: number;
      keyList: string[];
      columnCount: number;
      offset?: Offset;
      margin?: Margin;
      animation?: AnimationOptions;
      useExchanged?: boolean;
    }
  | {
      mode: 'Customized';
      sizeList: Size[];
      keyList: string[];
      layout: LayoutFn;
      offset?: Offset;
      animation?: AnimationOptions;
      useExchanged?: boolean;
    };

const createLayout = (options: StaticMovableListOptions): LayoutFn => {
  const mode = options.mode

  if (options.mode === 'Horizontal') {
    return createHorizontalLayout(options.spacing)
  }

  if (options.mode === 'Vertical') {
    return createVerticalLayout(options.spacing)
  }

  if (options.mode === 'Grid') {
    return createGridLayout(
      options.width,
      options.height,
      options.columnCount,
      options.margin
    )
  }

  if (options.mode === 'Customized') {
    return options.layout
  }

  throw new Error(`Unsupported mode: ${mode}`)
}

const createSizeList = (options: StaticMovableListOptions): Size[] => {
  const mode = options.mode

  if (options.mode === 'Horizontal') {
    return options.widthList.map((width) => {
      return {
        width,
        height: 0
      }
    })
  }

  if (options.mode === 'Vertical') {
    return options.heightList.map((height) => {
      return {
        width: 0,
        height
      }
    })
  }

  if (options.mode === 'Grid') {
    return options.keyList.map(() => {
      return {
        width: options.width,
        height: options.height
      }
    })
  }

  if (options.mode === 'Customized') {
    return options.sizeList
  }

  throw new Error(`Unsupported mode: ${mode}`)
}

const defaultMargin: Margin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

const createHorizontalLayout = (spacing = 0): LayoutFn => {
  return (sizeList) => {
    const rectList: Rect[] = []
    let latestX = 0

    for (let i = 0; i < sizeList.length; i++) {
      const item = sizeList[i]

      const rect: Rect = {
        width: item.width,
        height: item.height,
        x: i === 0 ? 0 : latestX,
        y: 0
      }

      latestX += item.width + spacing
      rectList.push(rect)
    }

    return rectList
  }
}

const createVerticalLayout = (spacing = 0): LayoutFn => {
  return (sizeList) => {
    const rectList: Rect[] = []
    let latestY = 0

    for (let i = 0; i < sizeList.length; i++) {
      const item = sizeList[i]

      const rect: Rect = {
        width: item.width,
        height: item.height,
        x: 0,
        y: i === 0 ? 0 : latestY
      }

      latestY += item.height + spacing
      rectList.push(rect)
    }

    return rectList
  }
}

const createGridLayout = (
  width: number,
  height: number,
  columnCount: number,
  margin: Margin = defaultMargin
): LayoutFn => {
  columnCount = Math.floor(columnCount)

  return (sizeList) => {
    const rectList: Rect[] = []

    for (let i = 0; i < sizeList.length; i++) {
      const columnIndex = i % columnCount
      const rowIndex = Math.floor(i / columnCount)

      const x = margin.left + columnIndex * width + columnIndex * margin.right
      const y = margin.top + rowIndex * height + rowIndex * margin.bottom

      const rect: Rect = {
        width,
        height,
        x,
        y
      }
      rectList.push(rect)
    }

    return rectList
  }
}

const isEqualRect = (leftRect: Rect, rightRect: Rect) => {
  const isEqualWidth = leftRect.width === rightRect.width
  const isEqualHeight = leftRect.height === rightRect.height
  const isEqualX = leftRect.x === rightRect.x
  const isEqualY = leftRect.y === rightRect.y
  return isEqualWidth && isEqualHeight && isEqualX && isEqualY
}

type IsEnter = (rect: Rect, position: MovablePosition) => boolean;

const isEnterX: IsEnter = (rect, position) => {
  return position.x >= rect.x && position.x <= rect.x + rect.width
}

const isEnterY: IsEnter = (rect, position) => {
  return position.y >= rect.y && position.y <= rect.y + rect.height
}

const isEnterArea: IsEnter = (rect, position) => {
  return isEnterX(rect, position) && isEnterY(rect, position)
}

const createEnterPredicateFn = (
  mode: StaticMovableListOptions['mode']
): IsEnter => {
  if (mode === 'Horizontal') {
    return isEnterX
  }

  if (mode === 'Vertical') {
    return isEnterY
  }

  if (mode === 'Grid') {
    return isEnterArea
  }

  if (mode === 'Customized') {
    return isEnterArea
  }

  throw new Error(`Unsupported mode: ${mode}`)
}

const layoutByPosition = (
  layout: LayoutFn,
  isEnter: IsEnter,
  useExchanged: boolean,
  keyList: string[],
  rectList: Rect[],
  activeKey: string,
  position: MovablePosition
) => {
  const enteredIndex = rectList.findIndex((rect) => isEnter(rect, position))

  if (enteredIndex === -1) {
    return {
      keyList,
      rectList
    }
  }

  const enteredKey = keyList[enteredIndex]

  if (enteredKey === activeKey) {
    return {
      keyList,
      rectList
    }
  }

  const activeIndex = keyList.indexOf(activeKey)

  if (activeIndex === -1) {
    throw new Error(`${activeKey} is not in [${keyList}]`)
  }

  if (activeIndex === enteredIndex) {
    return {
      keyList,
      rectList
    }
  }

  const newKeyList = [...keyList]

  const newSizeList: Size[] = rectList.map((rect) => {
    return {
      width: rect.width,
      height: rect.height
    }
  })

  const activeSize = newSizeList[activeIndex]
  const enteredSize = newSizeList[enteredIndex]

  if (useExchanged) {
    newKeyList[enteredIndex] = activeKey
    newKeyList[activeIndex] = enteredKey

    newSizeList[enteredIndex] = activeSize
    newSizeList[activeIndex] = enteredSize
  } else {
    if (activeIndex > enteredIndex) {
      const targetIndex = Math.max(enteredIndex - 1, 0)
      newKeyList.splice(activeIndex, 1)
      newSizeList.splice(activeIndex, 1)
      newKeyList.splice(targetIndex, 0, activeKey)
      newSizeList.splice(targetIndex, 0, activeSize)
    } else {
      const targetIndex = enteredIndex + 1
      newKeyList.splice(targetIndex, 0, activeKey)
      newSizeList.splice(targetIndex, 0, activeSize)
      newKeyList.splice(activeIndex, 1)
      newSizeList.splice(activeIndex, 1)
    }
  }

  const newRectList = layout(newSizeList)

  return {
    keyList: newKeyList,
    rectList: newRectList
  }
}

type MoverMap = {
  [key: string]: ReturnType<typeof Movable>;
};

const createMoverMap = (keyList: string[], rectList: Rect[]): MoverMap => {
  const moverMap: MoverMap = {}

  for (let i = 0; i < keyList.length; i++) {
    const key = keyList[i]
    const rect = rectList[i]
    const position = {
      x: rect.x,
      y: rect.y
    }
    const mover = Movable(position)
    moverMap[key] = mover
  }

  return moverMap
}

export const StaticMovableList = (options: StaticMovableListOptions) => {
  const layout = createLayout(options)

  const sizeList = createSizeList(options)

  const isEnter = createEnterPredicateFn(options.mode)

  const originKeyList = [...options.keyList]

  const useExchanged =
    options.useExchanged ??
    (options.mode !== 'Vertical' && options.mode !== 'Horizontal')

  const latestMovableInfoList: MovableInfo[] = []

  const animationOptions: AnimationOptions = {
    duration: 500,
    easing: 'easeOutCubic',
    disable: false,
    ...options.animation
  }

  const offset: Offset = {
    x: 0,
    y: 0,
    ...options.offset
  }

  let keyList = [...originKeyList]

  let rectList = layout(sizeList)

  const moverMap = createMoverMap(keyList, rectList)

  const moverList = Object.values(moverMap)

  const getMover = (key: string) => {
    const mover = moverMap[key]
    if (!mover) return null
    return mover
  }

  const start = (key: string, x: number, y: number) => {
    const mover = getMover(key)
    if (!mover) return
    mover.actions.start(x, y)
  }

  const move = (key: string, x: number, y: number) => {
    const mover = getMover(key)
    if (!mover) return
    mover.actions.move(x, y)
  }

  const end = (key: string, x: number, y: number) => {
    const mover = getMover(key)
    if (!mover) return
    const rect = rectList[keyList.indexOf(key)]
    mover.actions.end(x, y)
    mover.actions.animateTo(rect.x, rect.y)
  }

  const animateTo = (
    key: string,
    x: number,
    y: number,
    duration = 300,
    easing: EasingType = 'easeOutCubic'
  ) => {
    const mover = getMover(key)
    if (!mover) return
    mover.actions.animateTo(x, y, duration, easing)
  }

  const moveTo = (key: string, x: number, y: number) => {
    const mover = getMover(key)
    if (!mover) return
    mover.actions.moveTo(x, y)
  }

  const getCurrentRect = (key: string) => {
    const index = keyList.indexOf(key)
    if (index === -1) return
    return rectList[index]
  }

  const getActiveInfo = (x: number, y: number) => {
    if (!latestMovableInfoList.length) return null

    const targetPosition = {
      x: x - offset.x,
      y: y - offset.y
    }

    let targetIndex = -1
    let targetInfo: MovableInfo | null = null

    for (let i = 0; i < latestMovableInfoList.length; i++) {
      const info = latestMovableInfoList[i]
      const currentPosition = info.position
      const { width, height } = rectList[i]
      const currentRect = {
        width,
        height,
        x: currentPosition.x,
        y: currentPosition.y
      }

      if (!isEnter(currentRect, targetPosition)) continue

      if (!targetInfo || info.isAnimating) {
        targetInfo = info
        targetIndex = i
      }
    }

    if (targetIndex === -1) return null

    const key = keyList[targetIndex]
    const rect = rectList[targetIndex]

    return {
      key,
      index: targetIndex,
      info: targetInfo,
      rect
    }
  }

  const actions = {
    start,
    move,
    end,
    moveTo,
    animateTo,
    getCurrentRect,
    getActiveInfo
  }

  const state$ = combineLatest(moverList.map((item) => item.state$)).pipe(
    map((movableInfoList) => {
      return movableInfoList.map((info, index) => {
        const key = originKeyList[index]
        return {
          info,
          size: sizeList[index],
          key
        }
      })
    }),
    tap((list) => {
      const activeItem = list.find((item) => item.info.isMoving)

      if (!activeItem || !activeItem.info.interationPosition) return

      const activeKey = activeItem.key
      const interationPosition = activeItem.info.interationPosition

      const position = {
        x: interationPosition.x - offset.x,
        y: interationPosition.y - offset.y
      }

      const layoutInfo = layoutByPosition(
        layout,
        isEnter,
        useExchanged,
        keyList,
        rectList,
        activeKey,
        position
      )

      const newKeyList = layoutInfo.keyList
      const newRectList = layoutInfo.rectList

      const oldKeyList = keyList
      const oldRectList = rectList

      if (newKeyList === oldKeyList && newRectList === oldRectList) return

      keyList = newKeyList
      rectList = newRectList

      for (let i = 0; i < newKeyList.length; i++) {
        const key = newKeyList[i]

        if (key === activeKey) continue

        const newRect = newRectList[i]
        const oldRect = oldRectList[oldKeyList.indexOf(key)]

        const isEqual = isEqualRect(newRect, oldRect)

        if (isEqual) continue

        if (animationOptions.disable) {
          moveTo(key, newRect.x, newRect.y)
        } else {
          animateTo(
            key,
            newRect.x,
            newRect.y,
            animationOptions.duration,
            animationOptions.easing
          )
        }
      }
    }),
    map((list) => {
      const sortedList: typeof list = Array(list.length)

      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const targetIndex = keyList.indexOf(item.key)
        sortedList[targetIndex] = item
        latestMovableInfoList[targetIndex] = item.info
      }

      return sortedList
    }),
    publish(),
    refCount()
  )

  return {
    state$,
    actions
  }
}

