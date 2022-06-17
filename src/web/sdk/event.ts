import React from 'react'
import { fromEvent, Observable, scan, throttleTime } from 'rxjs'
export const inputListener = (ref: HTMLElement, handleInput: (ref) => (node: React.ChangeEvent<HTMLElement>) => void) => {
  fromEvent(ref, 'input')
    // .pipe(
    // throttleTime(1000),
    // )
    .subscribe((event) => handleInput(event))
}


type BLMouseEvent =
  | 'click'
  | 'dbclick'
  | 'mousedown'
  | 'mouseup'
  | 'mouseenter'
  | 'mouseleave'

type BLKeyboardEvent =
  | 'keydown'
  | 'keyup'
  | 'keypress'

type BLUIEvent =
  | BLMouseEvent
  | BLKeyboardEvent
type UpperCapitalize<T extends string> = T extends `${infer C}${infer S}` ? `${Uppercase<C>}${S}` : T

// use
type aa = 'alsdkjf'
type OwnCapitalize<T extends string> = UpperCapitalize<T>

type b = OwnCapitalize<aa>

type BLEventCallBack<T extends string> = {
  [K in T as `handle${Capitalize<K>}`]?: () => void
}

type BLEventListenrPramas<T> = {
  ref: T
  eventName: BLUIEvent
  callBack: BLEventCallBack<BLUIEvent>
}

type BLEventListenr<T> = (parmas: BLEventListenrPramas<T>) => void

export const mouseEventListenr: BLEventListenr<HTMLElement> = ({ ref, eventName, callBack }) => {
  fromEvent(ref, eventName)
    .subscribe(() => callBack)
}

const handleclick = () => {

}

const handleCLICK = () => {

}

const handleClick = () => {

}

const handleButton = () => {

}
mouseEventListenr({ ref: document.querySelector('#alsdkfj') as HTMLElement, eventName: 'dbclick', callBack: { handleClick } })

export const clickListener = (ref: HTMLElement, handleClick: (ref) => (node: React.ChangeEvent<HTMLElement>) => void) => {
  fromEvent<MouseEvent>(ref, 'click')
    .subscribe((event) => handleClick(ref)(event))
}

export const mouseDownLisetenr = (ref: HTMLElement, handlemouseDown: (ref) => (node: HTMLElement) => void) => () => {
  fromEvent<KeyboardEvent>(ref, 'keyDown')
    .subscribe((event) => handlemouseDown(event))
}

// export const mouseUpListener: <T extends HTMLElement> = (ref:HTMLElement, handleMouseUP: (ref)=>(node:HTMLElement)=>void) => () => {
// fromEvent<KeyboardEvent>(ref,'keyUp')
// .subscribe((event) => handleMouseUP)
// }

// export const canvas = new Observable(subscriber => {
// subscriber.next()
// })
// canvas.subscribe({
// next(){console.log('dont touch me')}
// })
