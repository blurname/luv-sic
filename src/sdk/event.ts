import {useEffect, useState} from 'react'
import { fromEvent, Observable, scan } from 'rxjs'
export const listenClick = () => {
  fromEvent(document, 'click')
    .subscribe((args) => console.log('hihi'))
}
export const canvas = new Observable(subscriber => {
  subscriber.next()
})
canvas.subscribe({
  next(){console.log('dont touch me')}
})
