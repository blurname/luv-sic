import React, { useState } from 'react'
import { Button } from './component/Button'
import { Tab, TabList, useTabList } from './component/Tab'
import { Input } from './component/Input'
const tabList: Tab[] = [
  {
    label: 'tab1',
    value: 'tab1'
  },
  {
    label: 'tab2',
    value: 'tab2'
  },
  {
    label: 'tab3',
    value: 'tab3'
  },
  {
    label: 'tab4',
    value: 'tab4'
  }
]
function App () {
  const { TabListRender } = useTabList(tabList)
  return (
    <div className="App" style={{ display: 'flex' }}>
      <Button>i am a button</Button>
      {TabListRender}
      <Input/>
    </div>
  )
}

export {
  App
}
