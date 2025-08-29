import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN, COLOR_TOKEN_PROTO } from '../colorToken'

type Tab = {
  label: string
  value: string | number
}
type Props = {
  activeTab: Tab
  tabList: Tab[]
  onClick: (value: Tab) => void
}
const TabList = ({ activeTab, tabList, onClick }: Props) => {
  return (
    <StyledTabList>
      {tabList.map((tab) => {
        const className = activeTab.value === tab.value ? 'tab active' : 'tab'
        return (
          <button
            key={tab.value}
            className={className}
            onClick={() => {
              onClick(tab)
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </StyledTabList>
  )
}
// https:// stackoverflow.com/questions/2802842/simple-css-tabs-need-to-break-border-on-active-tab
const StyledTabList = styled.div`
  .tab {
    width: 66px;
    height: 32px;
    font-size: 14px;
    border: none;
    border: 1px solid ${COLOR_TOKEN_PROTO.gray1};
    // border-top: 1px solid ${COLOR_TOKEN_PROTO.gray1};
    // border-bottom: 1px solid ${COLOR_TOKEN_PROTO.gray1};
    background: ${COLOR_TOKEN.button.bg};
    // margin-left: 1px;
    &:hover {
      background: ${COLOR_TOKEN_PROTO.blue2};
      border: 1px solid ${COLOR_TOKEN_PROTO.blue1};
    }
    &:active,
    &.active {
      color: ${COLOR_TOKEN_PROTO.blue1};
      background: ${COLOR_TOKEN_PROTO.blue2};
      border: 1px solid ${COLOR_TOKEN_PROTO.blue1};
    }
  }
  :nth-child(1) {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  :last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`
const useTabList = (tabList: Tab[]) => {
  const [activeTab, setActiveTab] = useState(tabList[0])
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  const TabListRender = useMemo(() => {
    return (
      <TabList
        activeTab={activeTab}
        tabList={tabList}
        onClick={handleTabClick}
      />
    )
  }, [activeTab, tabList])
  return {
    activeTab,
    TabListRender,
  }
}
export type { Tab }
export { TabList, useTabList }
