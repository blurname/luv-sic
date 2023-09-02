import styled from 'styled-components'
import React, { KeyboardEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import keys from 'ctrl-keys'

const handler = keys()

const createStorageStore = () => {
  const _tabData = new Map<string, TabItem>()

  // const getNextZ = () => {
  // }

  const init = () => {
    for (let x = 0; x < localStorage.length; x++) {
      const key = localStorage.key(x)
      if (key?.includes(STORAGE_PREFIX)) {
        _tabData.set(key, JSON.parse(localStorage.getItem(key) as string)as TabItem)
      }
    }

    console.log('tabSize', _tabData.size)
    if (_tabData.size === 0) {
      const newKey = `${STORAGE_PREFIX}_1`
      _tabData.set(newKey, {
        key: newKey,
        content: '',
        zIndex: getNextZ()
      })
    }
  }

  const getTablist = () => {
    const tabList:TabItem[] = []
    for (const td of _tabData) {
      const ti = td[1]
      tabList.push(ti)
    }

    return tabList.sort((a, b) => {
      return a.zIndex - b.zIndex
    })
  }

  return {
    _tabData,
    init,
    newItem, updateItem, deleteItem,
    save,
    getTabSize, getTablist
  }
}

type EditorProps = {
    store: ReturnType<typeof createStorageStore>
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
    store.save(activeTab)
  }

  const handleDelete = (key:string):React.MouseEventHandler<HTMLDivElement> => (e) => {
    store.deleteItem(key)
    const newTabList = store.getTablist()!
    const nextKey = newTabList.at(-1)['key']
    setTabList(newTabList)
    setActiveTab(nextKey)
  }

  const defaultValue = useMemo(() => {
    return store._tabData.get(activeTab)?.content
  }, [activeTab])

  const Editor = useCallback(() => {
    console.log('changedefault', activeTab)
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
    const ti = store.newItem()
    setTabList(store.getTablist())
    setActiveTab(ti.key)
  }

  // useEffect(() => {
  //   const combo = (e:KeyboardEvent) => {
  //     handler
  //       .add('ctrl+n', (e) => {
  //         e?.preventDefault()
  //         addNewTab()
  //         console.log('ctrl+n')
  //       })
  //       .add('ctrl+w', (e) => {
  //         e?.preventDefault()
  //         handleDelete(activeTab)(undefined as any)
  //         console.log('ctrl+w')
  //       })
  //     handler.handle(e)
  //   }
  //   document.addEventListener('keydown', combo)
  //   return () => {
  //     document.removeEventListener('keydown', combo)
  //   }
  // }, [activeTab, tabList])

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
              >
              <span
              onClick={onClick(t.key)}
              >{t.key}</span>
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
    isactive:boolean
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
  const store = createStorageStore()
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
