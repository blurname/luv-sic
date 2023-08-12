import React, { useState } from 'react'
import { VerticalDemo } from './demos/Vertical.js'
import { HorizontalDemo } from './demos/Horizontal.js'
import { GridDemo } from './demos/Grid.js'
import { CanvasDemo } from './demos/Canvas.js'

const modeList: string[] = [
  'Vertical',
  'Horizontal',
  'Grid',
  'Canvas'
]

const Animation = () => {
  const [currentMode, setMode] = useState('Vertical')

  return (
    <div>
      <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>
        {modeList.map((mode) => {
          const style = {
            color: currentMode !== mode ? 'blue' : void 0
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
  Animation
}
