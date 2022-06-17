import React, { useEffect, useRef, useState } from 'react'
import { clickListener, inputListener } from '../sdk/event'
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
    TIRef.style = `flex:1; background: rgba(${rgba.r},${rgba.g},${rgba.a},${rgba.a}) `
    TORef.style = `flex:1; background: rgba(${rgba2.r},${rgba2.g},${rgba2.a},${rgba2.a}) `
  }

  const handleTIClicking = (ref:HTMLTextAreaElement) => (e:React.MouseEvent<HTMLDivElement>) => {
    const rgba = randomRGBA()
    ref.style = `flex:1; background: rgba(${rgba.r},${rgba.g},${rgba.a},${rgba.a}) `
  }

  useEffect(() => {
    inputListener(TIRef.current, handleTIInputing)
    clickListener(TIRef.current, handleTIClicking)
    clickListener(TORef.current, handleTIClicking)
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <textarea ref={TIRef} style={{ flex: 1 }} id="TI" value={TIValue} />
      <textarea ref={TORef} style={{ flex: 1 }} id="TO" value={TIValue} />
    </div>
  )
}
