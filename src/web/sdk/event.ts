import { fromEvent, Observable, scan, throttleTime } from 'rxjs'
export const listenInput = (ref:React.RefObject<HTMLTextAreaElement>, handleInput: (node:React.ChangeEvent<HTMLTextAreaElement>)=>void) => {
  fromEvent(ref.current, 'input')
    //.pipe(
  //throttleTime(1000),
    //)
    .subscribe((node) => handleInput(node))
}
export const listenClick = (ref:React.RefObject<HTMLTextAreaElement>, handleClick: (ref)=>(node:React.ChangeEvent<HTMLTextAreaElement>)=>void) => {
  fromEvent(ref.current, 'click')
    .subscribe((event) => handleClick(ref)(event))
}

//export const canvas = new Observable(subscriber => {
//subscriber.next()
//})
//canvas.subscribe({
//next(){console.log('dont touch me')}
//})
