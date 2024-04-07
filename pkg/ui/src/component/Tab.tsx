import React from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN } from '../colorToken'
type Tab = {
  label: string
  value: string | number
}
type Props = {
  activeTab: Tab
  tabList: Tab[]
  onClick: (value:Tab)=>void
}
const TabList = ({ activeTab, tabList, onClick }:Props) => {
  return <StyledTabList>
  {tabList.map((tab) => {
    const className = activeTab.value === tab.value ? 'tab active' : 'tab'
    return (
        <button className={className} onClick={() => { onClick(tab) }}>{tab.label}</button>
    )
  })}
  </StyledTabList>
}
const StyledTabList = styled.div`
  .tab {
    border: none;
    background: ${COLOR_TOKEN.button.bg};
    &:hover {
      background: ${COLOR_TOKEN.button.hover};
    }
    &:active,
    &.active {
      background: ${COLOR_TOKEN.button.active};
    }
    }
`
export type {
  Tab
}
export {
  TabList
}
