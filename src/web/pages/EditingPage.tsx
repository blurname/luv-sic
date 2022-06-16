import React, { useEffect, useRef, useState } from 'react'
import { listenClick, listenInput } from '../sdk/event'
export function EditingPage () {
  const [ TIValue, setTIValue ] = useState('')
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

  const handleTIInputing = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setTIValue(e.target.value)
    const rgba = randomRGBA()
    const rgba2 = randomRGBA()
    TIRef.current.style = `flex:1; background: rgba(${rgba.r},${rgba.g},${rgba.a},${rgba.a}) `
    TORef.current.style = `flex:1; background: rgba(${rgba2.r},${rgba2.g},${rgba2.a},${rgba2.a}) `
  }

  const handleTIClicking = (ref:React.RefObject<HTMLTextAreaElement>) => (e:React.MouseEvent<HTMLDivElement>) => {
    const rgba = randomRGBA()
    ref.current.style = `flex:1; background: rgba(${rgba.r},${rgba.g},${rgba.a},${rgba.a}) `
  }

  useEffect(() => {
    listenInput(TIRef, handleTIInputing)
    listenClick(TIRef, handleTIClicking)
    listenClick(TORef, handleTIClicking)
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <textarea ref={TIRef} style={{ flex: 1 }} id="TI" value={TIValue} />
      <textarea ref={TORef} style={{ flex: 1 }} id="TO" value={TIValue} />
    </div>
  )
}
