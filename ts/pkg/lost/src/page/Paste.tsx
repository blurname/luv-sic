import React, { useState, useEffect } from 'react'

type TextList = { type:string, text: string, url?: string }[]
const Paste = () => {
  const [rendertTextList, setRendertTextList] = useState<TextList>([])
  useEffect(() => {
    const handlePaste = async (e:ClipboardEvent) => {
      const renderList:TextList = []
      for (const item of e.clipboardData!.items) {
        if (item.type.includes('image/png')) {
        //
          // const file = item.getAsFile()!
          // const uint8Array = new Uint8Array(await file.arrayBuffer())
          // console.log('image Uint8Array', uint8Array, String.fromCharCode(uint8Array.slice(0, 8)))
          //
          // console.log('image string', await file.text())
          // renderList.push({type:'image uint8Array',)
        //
        }
      }

      const clipboardItems = await navigator.clipboard.read()

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type)
          const text = await blob.text()
          if (type.includes('image')) {
            const url = URL.createObjectURL(blob)
            console.log('image', text)
            renderList.push({ type, text, url })
          } else {
            renderList.push({ type, text })
          }
        }
      }
      setRendertTextList(renderList)
    }
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [])

  // const handleCopy = async () => {
  //   const obj = { hello: 'world' }
  //   const blob = new Blob([JSON.stringify(obj, null, 2)], {
  //     type: 'application/json'
  //   })
  //   await navigator.clipboard.write([
  //     new ClipboardItem({
  //       'web text/plain': blob
  //     })
  //   ])
  // }

  return (
  <div>
  {/* <button onClick={handleCopy}>copy</button> */}
  <div>

  { rendertTextList.length === 0
    ? <h1>just paste</h1>

    : rendertTextList.map((t, index) => {
      return (
        <div key={index}>
        <h1>{t.type}</h1>
        {
          t.type.includes('image') ? <img src={t.url} / >
            : <p>{t.text}</p>
        }
        </div>
      )
    })}
  </div>
  </div>
  )
}

export {
  Paste
}
