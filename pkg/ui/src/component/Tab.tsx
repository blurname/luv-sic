import React from 'react'
import styled from 'styled-components'
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
    background: ${props => props.theme.button.bg};
    &:hover {
      background: ${props => props.theme.button.hover};
    }
    &:active,
    &.active {
      background: ${props => props.theme.button.active};
    }
    }
`
export type {
  Tab
}
export {
  TabList
}
