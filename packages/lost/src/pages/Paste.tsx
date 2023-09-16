import React, { useState, useEffect } from 'react'
// 1. html like (<meta charset="utf-8">
// <div>
//    <span data-text="" />
//    <span data-richtext="" />
//    <span data-ita="" />
//    <span style="white-space:pre-wrap"></span>
// </div>
// )
//
const Paste = () => {
  const [rendertText, setRendertText] = useState('')
  useEffect(() => {
    const handlePaste = async (e:ClipboardEvent) => {
      let finalT = ''
      console.log(e.clipboardData)
      const clipboardItems = await navigator.clipboard.read()

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type)
          const text = await blob.text()
          finalT += text
          console.log('type', type, text)
        }
      }
      setRendertText(finalT)
    }
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [])

  const handleCopy = async () => {
    const obj = { hello: 'world' }
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json'
    })
    await navigator.clipboard.write([
      new ClipboardItem({
        'web text/plain': blob
      })
    ])
  }

  return (
  <div>
  <button onClick={handleCopy}>copy</button>
  <div>

  {rendertText}
  </div>
  <textarea/>
  </div>
  )
}

export {
  Paste
}
