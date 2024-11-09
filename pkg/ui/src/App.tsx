import React from 'react'
import { Button } from './component/Button'
import { Tab, useTabList } from './component/Tab'
import { Input } from './component/Input'
import { SelfControlInput } from './component/SelfControlInput'
import { GlobalSearch } from './component/GlobalSearch'
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
    <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
      <Button type="primary">登录</Button>
      <Button type="primary" disabled={true}>登录</Button>
      <Button type="second" >登录</Button>
      <Button type="second" disabled={true}>登录</Button>
      {TabListRender}
      <Input />
      <SelfControlInput handleConfirm={(i) => { console.log(i) }} initialValue={''} />
      <GlobalSearch />
    </div>
  )
}

export {
  App
}
