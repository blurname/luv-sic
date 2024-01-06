// { getFigJsonData } from 'fig-to-json'
import React, { useEffect } from 'react'
import { getFigJsonData } from './fig-to-json/index'
const FigToJson = () => {
  const onChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const arrayBuffer = e.target.result
      console.log(arrayBuffer)
      console.log(getFigJsonData(arrayBuffer))
    }

    reader.readAsArrayBuffer(file)
  }
  return (
  <div>
  hello
  <input type="file" name="upload" id="upload" onChange={onChange} />
  </div>
  )
}

export {
  FigToJson
}
