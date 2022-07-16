import React, { useEffect, useRef, useState } from 'react'
// import { async } from 'rxjs'
import init, {add_zwsp } from '../../wasm/ZWSP/ZWSP.js'
import { clickListener, inputListener } from '../sdk/event'
export function EditingPage() {
  const [TIValue, setTIValue] = useState('')
  const TIRef = useRef<HTMLTextAreaElement>(null)
  const TORef = useRef<HTMLTextAreaElement>(null)
  const randomRGBA = () => {
    return {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
      a: Math.random() / 4
    }
  }
  
  const handleTIInputing = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const k = add_zwsp(e.target.value)
    console.log(k)
    setTIValue(e.target.value.split('').join('\u200b'))
    // const rgba = randomRGBA()
    // const rgba2 = randomRGBA()
    // TIRef.current!.style.setProperty('background:', ` rgba(${rgba.r},${rgba.g},${rgba.a},${rgba.a}) `)
    // TORef.current!.style.setProperty('background', `rgba(${rgba2.r},${rgba2.g},${rgba2.a},${rgba2.a}) `)
  }

  const handleTIClicking = (ref: HTMLTextAreaElement) => (e: React.MouseEvent<HTMLDivElement>) => {
    const rgba = randomRGBA()
    ref.style.setProperty('background', ` rgba(${rgba.r},${rgba.g},${rgba.a},${rgba.a} `)
  }


  useEffect(() => {
    const initWasm = async () => {
      await init()
    }
    initWasm()
    inputListener(TIRef.current!, handleTIInputing)
  }, []);
  // useEffect(() => {
  //   inputListener(TIRef.current!, handleTIInputing)
  //   clickListener(TIRef.current!, handleTIClicking)
  //   clickListener(TORef.current!, handleTIClicking)
  // }, [wasm])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <textarea ref={TIRef} style={{ flex: 1, background: "rgba(63, 236, 0, 0.05)" }} id="TI" />
      <textarea ref={TORef} style={{ flex: 1, background: "rgba(135, 63, 234, 0.05)" }} id="TO" value={TIValue} />
    </div>
  )
}
