/* eslint-disable import/group-exports */
import { Subject, merge } from 'rxjs'
import {
  withLatestFrom,
  map,
  tap,
  takeUntil,
  pairwise,
  switchMap,
  startWith,
  shareReplay,
  publish,
  refCount
} from 'rxjs/operators'
import { Duration } from './duration.js'
import * as Easing from './easing.js'

export type EasingFn = (input: number) => number;
export type EasingType = keyof typeof Easing | EasingFn;

export type MovablePosition = {
  x: number;
  y: number;
};

export type InteractionPosition = {
  x: number;
  y: number;
} | null;

export type AnimateOptions = {
  position: MovablePosition;
  duration: number;
  easing: EasingFn;
};

export type MovableInfo = {
  type: string;
  position: MovablePosition;
  interationPosition: InteractionPosition;
  isMoving: boolean;
  isAnimating: boolean;
};

export const Movable = (initialPosition: MovablePosition = { x: 0, y: 0 }) => {
  // subjects
  const positionSubject = new Subject<MovablePosition>()
  const interactionPositionSubject = new Subject<InteractionPosition>()

  const moveToSubject = new Subject<MovablePosition>()
  const animateToSubject = new Subject<AnimateOptions>()

  const startingSubject = new Subject<MovablePosition>()
  const movingSubject = new Subject<MovablePosition>()
  const endingSubject = new Subject<MovablePosition>()

  const animationStartSubject = new Subject()
  const animationEndSubject = new Subject()

  const movementStartSubject = new Subject()
  const movementEndSubject = new Subject()

  // observables
  const position$ = positionSubject.pipe(
    startWith(initialPosition),
    shareReplay(1)
  )

  const interactionPosition$ = interactionPositionSubject.pipe(startWith(null))

  const moveTo$ = moveToSubject.asObservable() // 讲用处 https://stackoverflow.com/a/71934215
  const animateTo$ = animateToSubject.asObservable()

  const starting$ = startingSubject.pipe(
    tap<MovablePosition>(movementStartSubject)
  )
  const moving$ = movingSubject.asObservable()
  const ending$ = endingSubject.pipe(tap<MovablePosition>(movementEndSubject))

  const animationStart$ = animationStartSubject.asObservable()
  const animationEnd$ = animationEndSubject.asObservable()

  const movementStart$ = movementStartSubject.asObservable()
  const movementEnd$ = movementEndSubject.asObservable()

  // positions
  const moveToPosition$ = moveTo$.pipe(
    tap<MovablePosition>((position) => { // used for execute side effect, but will be deprecated in 8.0 https://rxjs.dev/api/index/function/tap
      positionSubject.next(position)
    })
  )

  const movingPosition$ = starting$.pipe(
    switchMap((startPosition) => {
      return moving$.pipe(
        takeUntil(ending$),
        startWith(startPosition),
        pairwise(),
        map(([prev, curr]) => {
          return {
            x: curr.x - prev.x,
            y: curr.y - prev.y
          }
        }),
        withLatestFrom(position$),
        map(([offset, currentPosition]) => {
          const x = currentPosition.x + offset.x
          const y = currentPosition.y + offset.y
          return { x, y } as MovablePosition
        })
      )
    }),
    tap<MovablePosition>((position) => {
      positionSubject.next(position)
    })
  )

  const animatingPosition$ = animateTo$.pipe(
    withLatestFrom(position$),
    switchMap(([options, prevPosition]) => {
      const startX = prevPosition.x
      const startY = prevPosition.y
      const diffX = options.position.x - startX
      const diffY = options.position.y - startY
      let isStart = false

      return Duration(options.duration).pipe(
        takeUntil(starting$),
        map(options.easing),
        map((currentDuration) => {
          const newPosition: MovablePosition = {
            x: currentDuration * diffX + startX,
            y: currentDuration * diffY + startY
          }
          return newPosition
        }),
        tap<MovablePosition>({
          next: () => {
            if (isStart) return
            isStart = true
            animationStartSubject.next()
          },
          complete: () => animationEndSubject.next()
        })
      )
    }),
    tap<MovablePosition>((position) => {
      positionSubject.next(position)
    })
  )

  const animationStartPosition$ = animationStart$.pipe(
    withLatestFrom(position$),
    map(([_, position]) => position)
  )

  const animationEndPosition$ = animationEnd$.pipe(
    withLatestFrom(position$),
    map(([_, position]) => position)
  )

  const movementStartPosition$ = movementStart$.pipe(
    withLatestFrom(position$),
    map(([_, position]) => position)
  )

  const movementEndPosition$ = movementEnd$.pipe(
    withLatestFrom(position$),
    map(([_, position]) => position)
  )

  // actions
  const start = (x: number, y: number) => {
    const position = { x, y }
    startingSubject.next(position)
    interactionPositionSubject.next(position)
  }

  const move = (x: number, y: number) => {
    const position = { x, y }
    movingSubject.next(position)
    interactionPositionSubject.next(position)
  }

  const end = (x = 0, y = 0) => {
    const position = { x, y }
    endingSubject.next(position)
    interactionPositionSubject.next(null)
  }

  const moveTo = (x: number, y: number) => {
    const position = { x, y }
    moveToSubject.next(position)
  }

  const animateTo = (
    x: number,
    y: number,
    duration = 500,
    easing: EasingType = 'easeOutCubic'
  ) => {
    const position = { x, y }
    const easingFn = typeof easing === 'function' ? easing : Easing[easing]
    animateToSubject.next({
      position,
      duration,
      easing: easingFn
    })
  }

  const actions = {
    start,
    move,
    end,
    moveTo,
    animateTo
  }

  // merged state
  const state$ = merge(
    moveToPosition$.pipe(
      map((position) => {
        return {
          type: 'MoveTo',
          position,
          isMoving: false,
          isAnimating: false
        }
      })
    ),
    movingPosition$.pipe(
      map((position) => {
        return {
          type: 'Moving',
          position,
          isMoving: true,
          isAnimating: false
        }
      })
    ),
    movementStartPosition$.pipe(
      map((position) => {
        return {
          type: 'MovementStart',
          position,
          isMoving: true,
          isAnimating: false
        }
      })
    ),
    movementEndPosition$.pipe(
      map((position) => {
        return {
          type: 'MovementEnd',
          position,
          isMoving: false,
          isAnimating: false
        }
      })
    ),
    animatingPosition$.pipe(
      map((position) => {
        return {
          type: 'Animating',
          position,
          isMoving: false,
          isAnimating: true
        }
      })
    ),
    animationStartPosition$.pipe(
      map((position) => {
        return {
          type: 'AnimationStart',
          position,
          isMoving: false,
          isAnimating: true
        }
      })
    ),
    animationEndPosition$.pipe(
      map((position) => {
        return {
          type: 'AnimationEnd',
          position,
          isMoving: false,
          isAnimating: false
        }
      })
    )
  ).pipe(
    startWith({
      type: 'Initial',
      position: initialPosition,
      isMoving: false,
      isAnimating: false
    }),
    withLatestFrom(interactionPosition$),
    map(([info, interationPosition]) => {
      const result: MovableInfo = {
        ...info,
        interationPosition
      }
      return result
    }),
    publish(),
    refCount()
  )

  // output
  return {
    state$,
    actions
  }
}
