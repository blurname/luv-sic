import React from 'react';
export declare const inputListener: (ref: HTMLElement, handleInput: (ref: any) => (node: React.ChangeEvent<HTMLElement>) => void) => void;
type BLMouseEvent = 'click' | 'dbclick' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave';
type BLKeyboardEvent = 'keydown' | 'keyup' | 'keypress';
type BLUIEvent = BLMouseEvent | BLKeyboardEvent;
type BLEventCallBack<T extends string> = {
    [K in T as `handle${Capitalize<K>}`]?: () => void;
};
type BLEventListenrPramas<T> = {
    ref: T;
    eventName: BLUIEvent;
    callBack: BLEventCallBack<BLUIEvent>;
};
type BLEventListenr<T> = (parmas: BLEventListenrPramas<T>) => void;
export declare const mouseEventListenr: BLEventListenr<HTMLElement>;
export declare const clickListener: (ref: HTMLElement, handleClick: (ref: any) => (node: React.ChangeEvent<HTMLElement>) => void) => void;
export declare const mouseDownLisetenr: (ref: HTMLElement, handlemouseDown: (ref: any) => (node: HTMLElement) => void) => () => void;
export type KeyCode = 'KeyA' | 'KeyB' | 'KeyC' | 'KeyD' | 'KeyE' | 'KeyF' | 'KeyG' | 'KeyH' | 'KeyI' | 'KeyJ' | 'KeyK' | 'KeyL' | 'KeyM' | 'KeyN' | 'KeyO' | 'KeyP' | 'KeyQ' | 'KeyR' | 'KeyS' | 'KeyT' | 'KeyU' | 'KeyV' | 'KeyW' | 'KeyX' | 'KeyY' | 'KeyZ' | 'Digit0' | 'Digit1' | 'Digit2' | 'Digit3' | 'Digit4' | 'Digit5' | 'Digit6' | 'Digit7' | 'Digit8' | 'Digit9' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12' | 'F13' | 'F14' | 'F15' | 'F16' | 'F17' | 'F18' | 'F19' | 'F20' | 'MetaLeft' | 'AltLeft' | 'ShiftLeft' | 'ControlLeft' | 'MetaRight' | 'AltRight' | 'ShiftRight' | 'ControlRight' | 'ArrowRight' | 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'Function' | 'Delete' | 'Home' | 'End' | 'PageUp' | 'PageDown' | 'Backquote' | 'CapsLock' | 'Tab' | 'Space' | 'Backspace' | 'Enter' | 'Escape' | 'Backslash' | 'Comma' | 'Equal' | 'BracketLeft' | 'Minus' | 'Period' | 'Quote' | 'BracketRight' | 'Semicolon' | 'Slash' | 'Numpad0' | 'Numpad1' | 'Numpad2' | 'Numpad3' | 'Numpad4' | 'Numpad5' | 'Numpad6' | 'Numpad7' | 'Numpad8' | 'Numpad9' | 'NumLock' | 'NumpadEqual' | 'NumpadDivide' | 'NumpadMultiply' | 'NumpadSubtract' | 'NumpadAdd' | 'NumpadEnter' | 'NumpadDecimal';
export {};
//# sourceMappingURL=event.d.ts.map