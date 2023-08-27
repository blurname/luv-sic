import styled from 'styled-components'
import React, { KeyboardEventHandler, useCallback, useEffect, useMemo, useState } from 'react'

type Tab = {
  key: string
  name: string
}

const STORAGE_PREFIX = 'LOST_BUFFER'

const storageStore = () => {
  const _tabData = new Map<string, string>()

  const init = () => {
    for (let x = 0; x < localStorage.length; x++) {
      const key = localStorage.key(x)
      if (key?.includes(STORAGE_PREFIX)) {
        _tabData.set(key, localStorage.getItem(key) as string)
      }
    }
    if (_tabData.size === 0) {
      _tabData.set(`${STORAGE_PREFIX}_1`, '')
    }
  }

  const updateItem = (key:string, content:string) => {
    _tabData.set(key, content)
    localStorage.setItem(key, _tabData.get(key) as string)
  }

  const save = (key:string) => {
    localStorage.setItem(key, _tabData.get(key) as string)
  }

  const deleteItem = (key:string) => {
    _tabData.delete(key)
    localStorage.removeItem(key)
  }

  const getTabSize = () => {
    return _tabData.size
  }

  const getTablist = () => {
    const tabList:Tab[] = []
    for (const kv of _tabData) {
      const key = kv[0]
      tabList.push({ key, name: key })
    }
    return tabList
  }

  return {
    _tabData,
    init,
    updateItem, deleteItem,
    save,
    getTabSize, getTablist
  }
}

type EditorProps = {
    store: ReturnType<typeof storageStore>
  }
const Tabs = ({ store }:EditorProps) => {
  const [tabList, setTabList] = useState(() => {
    return store.getTablist()
  })
  const [activeTab, setActiveTab] = useState(tabList[0].key)

  const onClick = (key:string) => (e:any) => {
    setActiveTab(key)
  }

  const onKeyUp:KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    store.updateItem(activeTab, e.currentTarget.value)
  }

  const onBlur:React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
    console.log('blur', activeTab)
    store.save(activeTab)
  }

  const handleDelete = (key:string):React.MouseEventHandler<HTMLDivElement> => (e) => {
    store.deleteItem(key)
    // if (key === activeTab) {
    //   setActiveTab()
    // }
  }

  const defaultValue = useMemo(() => {
    return store._tabData.get(activeTab)
  }, [activeTab])

  const Editor = useCallback(() => {
    return (
      <StyledEditor
      onKeyUp={onKeyUp}
      onBlur={onBlur}
      onClick={onBlur}
      style={{ flex: 1 }}
      defaultValue={defaultValue}
      />
    )
  }, [activeTab])

  const addNewTab = () => {
    const newKey = `${STORAGE_PREFIX}_${store.getTabSize() + 1}`
    store.updateItem(newKey, '')
    store.save(newKey)
    setTabList(store.getTablist())
    setActiveTab(newKey)
  }
  useEffect(() => {
    const keyCB = (e:KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', keyCB)

    return () => {
      document.removeEventListener('keydown', keyCB)
    }
  }, [])

  return (
      <>
      <StyledTabs>
      {tabList.map((t) => {
        return (
              <StyledTab
              key={t.key}
              isactive={t.key === activeTab}
              onClick={onClick(t.key)}
              >
              <span>{t.name}</span>
              <div className="del-btn" onClick={handleDelete(t.key)}>x</div>
              <div className="divider" />
              </StyledTab>
        )
      })}
      <div className="add-btn"
      onClick={addNewTab}
      >+</div>
      </StyledTabs>
      <Editor/>
      </>
  )
}
const StyledTabs = styled.div`
  display: flex;
  cursor: default;
  user-select: none;
  font-size: 12px;

  .add-btn {

    &:hover {
background:${props => props.isactive ? 'rgba(135, 63, 234, 0.4)' : 'rgba(135, 63, 234, 0.1)'}; ;
    }
`

type StyledTabProps = {
    isActive:boolean
}

const StyledEditor = styled.textarea`
  outline: none;
`
const StyledTab = styled.div<StyledTabProps>`
  display: flex;
  span {
  background: ${props => props.isactive ? 'rgba(135, 63, 234, 0.4)' : 'whtie'};
  &:hover {
    background:${props => props.isactive ? 'rgba(135, 63, 234, 0.4)' : 'rgba(135, 63, 234, 0.1)'}; ;
  }
    }
  .del-btn {
      &:hover {
        background: red;
        }
    }
  .divider {
      width: 2px;
      background: rgba(15, 6, 2, 0.4);
      margin-right: 10px;
    }
`

const Buffer = () => {
  const store = storageStore()
  store.init()

  return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs store={store} />
      </div>
  )
}

export {
  Buffer
}
