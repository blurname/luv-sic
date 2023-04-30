// import React from 'react'
// import { fromEvent, Observable, scan, throttleTime, of } from 'rxjs'
// export const inputListener = (
// ref: HTMLElement,
// handleInput: (ref) => (node: React.ChangeEvent<HTMLElement>) => void,
// ) => {
// fromEvent(ref, 'input')
/// / .pipe(
/// / throttleTime(1000),
/// / )
// .subscribe((event) => handleInput(event))
// }

// type BLMouseEvent = 'click' | 'dbclick' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave'

// type BLKeyboardEvent = 'keydown' | 'keyup' | 'keypress'

// type BLUIEvent = BLMouseEvent | BLKeyboardEvent
// type UpperCapitalize<T extends string> = T extends `${infer C}${infer S}` ? `${Uppercase<C>}${S}` : T

/// / use
// type aa = "i'm not good"
// type OwnCapitalize<T extends string> = UpperCapitalize<T>

// type b = OwnCapitalize<aa>

// type BLEventCallBack<T extends string> = {
// [K in T as `handle${Capitalize<K>}`]?: () => void
// }

// type BLEventListenrPramas<T> = {
// ref: T
// eventName: BLUIEvent
// callBack: BLEventCallBack<BLUIEvent>
// }

// type BLEventListenr<T> = (parmas: BLEventListenrPramas<T>) => void

// export const mouseEventListenr: BLEventListenr<HTMLElement> = ({ ref, eventName, callBack }) => {
// fromEvent(ref, eventName).subscribe(() => callBack)
// }

// const handleclick = () => {}

// const handleCLICK = () => {}

// const handleClick = () => {}

// const handleButton = () => {}

/// / mouseEventListenr({ ref: document.querySelector('#alsdkfj') as HTMLElement, eventName: 'dbclick', callBack: { handleClick } })

// export const clickListener = (
// ref: HTMLElement,
// handleClick: (ref) => (node: React.ChangeEvent<HTMLElement>) => void,
// ) => {
// fromEvent<MouseEvent>(ref, 'click').subscribe((event) => handleClick(ref)(event))
// }

// export const mouseDownLisetenr = (ref: HTMLElement, handlemouseDown: (ref) => (node: HTMLElement) => void) => () => {
// fromEvent<KeyboardEvent>(ref, 'keyDown').subscribe((event) => handlemouseDown(event))
// }

// export type KeyCode =
// | 'KeyA'
// | 'KeyB'
// | 'KeyC'
// | 'KeyD'
// | 'KeyE'
// | 'KeyF'
// | 'KeyG'
// | 'KeyH'
// | 'KeyI'
// | 'KeyJ'
// | 'KeyK'
// | 'KeyL'
// | 'KeyM'
// | 'KeyN'
// | 'KeyO'
// | 'KeyP'
// | 'KeyQ'
// | 'KeyR'
// | 'KeyS'
// | 'KeyT'
// | 'KeyU'
// | 'KeyV'
// | 'KeyW'
// | 'KeyX'
// | 'KeyY'
// | 'KeyZ'
// | 'Digit0'
// | 'Digit1'
// | 'Digit2'
// | 'Digit3'
// | 'Digit4'
// | 'Digit5'
// | 'Digit6'
// | 'Digit7'
// | 'Digit8'
// | 'Digit9'
// | 'F1'
// | 'F2'
// | 'F3'
// | 'F4'
// | 'F5'
// | 'F6'
// | 'F7'
// | 'F8'
// | 'F9'
// | 'F10'
// | 'F11'
// | 'F12'
// | 'F13'
// | 'F14'
// | 'F15'
// | 'F16'
// | 'F17'
// | 'F18'
// | 'F19'
// | 'F20'
// | 'MetaLeft'
// | 'AltLeft'
// | 'ShiftLeft'
// | 'ControlLeft'
// | 'MetaRight'
// | 'AltRight'
// | 'ShiftRight'
// | 'ControlRight'
// | 'ArrowRight'
// | 'ArrowUp'
// | 'ArrowLeft'
// | 'ArrowDown'
// | 'Function'
// | 'Delete'
// | 'Home'
// | 'End'
// | 'PageUp'
// | 'PageDown'
// | 'Backquote'
// | 'CapsLock'
// | 'Tab'
// | 'Space'
// | 'Backspace'
// | 'Enter'
// | 'Escape'
// | 'Backslash'
// | 'Comma'
// | 'Equal'
// | 'BracketLeft'
// | 'Minus'
// | 'Period'
// | 'Quote'
// | 'BracketRight'
// | 'Semicolon'
// | 'Slash'
// | 'Numpad0'
// | 'Numpad1'
// | 'Numpad2'
// | 'Numpad3'
// | 'Numpad4'
// | 'Numpad5'
// | 'Numpad6'
// | 'Numpad7'
// | 'Numpad8'
// | 'Numpad9'
// | 'NumLock'
// | 'NumpadEqual'
// | 'NumpadDivide'
// | 'NumpadMultiply'
// | 'NumpadSubtract'
// | 'NumpadAdd'
// | 'NumpadEnter'
// | 'NumpadDecimal'
// type Key =
// | '1'
// | '2'
// | '3'
// | '4'
// | '5'
// | '6'
// | '7'
// | '8'
// | '9'
// | '0'
// | '-'
// | '+'
// | 'q'
// | 'w'
// | 'e'
// | 'r'
// | 't'
// | 'y'
// | 'u'
// | 'i'
// | 'o'
// | 'p'
// | '['
// | ']'
// | 'a'
// | 's'
// | 'd'
// | 'f'
// | 'g'
// | 'h'
// | 'j'
// | 'k'
// | 'l'
// | ';'
// | ''
// | 'z'
// | 'x'
// | 'c'
// | 'v'
// | 'b'
// | 'n'
// | 'm'
// | ','
// | '.'
// | '/'
// | 'Shift'
// | 'Alt'
// | 'Control'
// | 'Tab'
// | 'ArrowUp'
// | 'ArrowDown'
// | 'ArrowLeft'
// | 'ArrowRight'
// | 'Enter'
// | '\\'
// | '`'
// | ''

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
