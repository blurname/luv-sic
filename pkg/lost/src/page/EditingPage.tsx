import React, { useEffect, useRef, useState } from 'react'
// import { async } from 'rxjs'
import init, { add_zwsp } from '../../wasm/ZWSP/ZWSP.js'
import { useRepeat } from '../hooks/useRepeat'
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

  const handleTIClicking =
    (ref: HTMLTextAreaElement) => (e: React.MouseEvent<HTMLDivElement>) => {
      const rgba = randomRGBA()
      ref.style.setProperty(
        'background',
        ` rgba(${rgba.r},${rgba.g},${rgba.a},${rgba.a} `
      )
    }

  const { setCanRepeat } = useRepeat(100, testZWSP())
  useEffect(() => {
    const initWasm = async () => {
      await init()
      setCanRepeat(true)
      // const longString = 'b'.repeat(10*1024*1024*10)
      // const jsBegin = performance.now()
      // const jsResult = longString.split('').join('\u200b')
      // const jsEnd = performance.now()
      // console.log("js",jsEnd - jsBegin)
      // const wasmBegin = performance.now()
      // const wasmResult = add_zwsp(longString)
      // const wasmEnd = performance.now()
      // console.log("wasm",wasmEnd-wasmBegin)
    }
    initWasm()
    // inputListener(TIRef.current!, handleTIInputing)
  }, [])
  // useEffect(() => {
  //   inputListener(TIRef.current!, handleTIInputing)
  //   clickListener(TIRef.current!, handleTIClicking)
  //   clickListener(TORef.current!, handleTIClicking)
  // }, [wasm])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <textarea
        ref={TIRef}
        style={{ flex: 1, background: 'rgba(63, 236, 0, 0.05)' }}
        id="TI"
      />
      <textarea
        ref={TORef}
        style={{ flex: 1, background: 'rgba(135, 63, 234, 0.05)' }}
        id="TO"
        value={TIValue}
      />
    </div>
  )
}
let jsTotalTime = 0
const jsReTotalTime = 0
let wasmTotalTime = 0
const testZWSP = () => {
  const mainTest = () => {
    const longString = 'b'.repeat(10 * 1024 * 1024)
    const jsBegin = performance.now()
    const jsResult = longString.split('').join('\u200b')
    const jsEnd = performance.now()
    // console.log(jsEnd- jsBegin)
    jsTotalTime += jsEnd - jsBegin
    // const jsReBegin = performance.now()
    // const jsReResult = longString.replaceAll(/\w(?=\w)/g,'$&')
    // const jsReEnd = performance.now()
    /// /console.log(jsEnd- jsBegin)
    // jsReTotalTime += (jsReEnd-jsReBegin)
    // console.log(jsTotalTime)
    const wasmBegin = performance.now()
    const wasmResult = add_zwsp(longString)
    const wasmEnd = performance.now()
    wasmTotalTime += wasmEnd - wasmBegin
  }
  const testResult = () => {
    console.log(`spilit join js ${jsTotalTime} ms`)
    // console.log(`replaceAll js ${jsReTotalTime} ms`)
    console.log(`wasm ${wasmTotalTime} ms`)
  }
  return {
    mainTest,
    testResult
  }
}
