import React, { useState } from 'react'
import { Button } from './component/Button'
import { ThemeProvider } from 'styled-components'
import { COLOR_TOKEN } from './colorToken'
import { Tab, TabList } from './component/Tab'
import { Input } from './component/Input'
const theme = {
  ...COLOR_TOKEN
}
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
  const [activeTab, setActiveTab] = useState(tabList[0])
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
    <ThemeProvider theme={theme}>
      <Button>i am a button</Button>
      <TabList activeTab={activeTab} tabList={tabList} onClick={handleTabClick} />
      <Input/>
    </ThemeProvider>
    </div>
  )
}

export {
  App
}
