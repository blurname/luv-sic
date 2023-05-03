import React, { useState } from 'react'
import { VerticalDemo } from './demos/Vertical'
import { HorizontalDemo } from './demos/Horizontal'
import { GridDemo } from './demos/Grid'
import { CanvasDemo } from './demos/Canvas'

const modeList: string[] = [
  'Vertical',
  'Horizontal',
  'Grid',
  'Canvas'
]

const RxAnimationPage = () => {
  const [currentMode, setMode] = useState('Vertical')

  return (
    <div>
      <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>
        {modeList.map((mode) => {
          const style = {
            color: currentMode !== mode ? 'blue' : undefined
          }
          const handleClick = () => {
            setMode(mode)
          }
          return (
            <React.Fragment key={mode}>
              <span style={style} onClick={handleClick}>
                {mode}
              </span>{' '}
            </React.Fragment>
          )
        })}
      </div>
      {currentMode === 'Vertical' && <VerticalDemo />}
      {currentMode === 'Horizontal' && <HorizontalDemo />}
      {currentMode === 'Grid' && <GridDemo />}
      {currentMode === 'Canvas' && <CanvasDemo />}
    </div>
  )
}

export {
  RxAnimationPage
}
