import { fromEvent } from 'rxjs';
export const inputListener = (ref, handleInput) => {
    fromEvent(ref, 'input')
        // .pipe(
        // throttleTime(1000),
        // )
        .subscribe((event) => handleInput(event));
};
export const mouseEventListenr = ({ ref, eventName, callBack }) => {
    fromEvent(ref, eventName).subscribe(() => callBack);
};
const handleclick = () => { };
const handleCLICK = () => { };
const handleClick = () => { };
const handleButton = () => { };
// mouseEventListenr({ ref: document.querySelector('#alsdkfj') as HTMLElement, eventName: 'dbclick', callBack: { handleClick } })
export const clickListener = (ref, handleClick) => {
    fromEvent(ref, 'click').subscribe((event) => handleClick(ref)(event));
};
export const mouseDownLisetenr = (ref, handlemouseDown) => () => {
    fromEvent(ref, 'keyDown').subscribe((event) => handlemouseDown(event));
};
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
