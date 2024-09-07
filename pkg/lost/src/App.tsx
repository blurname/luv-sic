import React from 'react'
import { RandomPress } from './page/RandomPress'
import { Lock } from './page/Lock'
import { createUrlInit } from '@blurname/core/src/browser/url'
import { Paste } from './page/Paste'
import { Buffer } from './page/Buffer'
import { RxGround } from './page/RxGround'
import { Play } from './page/Play'
import { Table } from './page/Table'
import { Menu, MenuItem } from '@blurname/ui/src/component/ContextMenu'
import { navigateToPageByHref } from './util/url'
const urlConfig = {
  'lock': () => 'lock',
  'press': () => 'press',
  'paste': () => 'paste',
  'buffer': () => 'buffer',
  'effect': () => 'effect',
  'play': () => 'play',
  'table': () => 'table'
}
const urlInit = createUrlInit(urlConfig)
const page = urlInit()
function App () {
  const changePage = (page:string) => {
    const host = globalThis.location.host
    const newHref = `${host}?${page}`
    navigateToPageByHref(newHref)
  }

  return (
    <div style={{ boxSizing: 'border-box', overflow: 'hidden' }} className="App">
      <Menu>
        <MenuItem label="lock" onClick={() => changePage('lock')} />
        <MenuItem label="buffer" onClick={() => changePage('buffer')} />
        <MenuItem label="press" onClick={() => changePage('press')} />
        <MenuItem label="paste" onClick={() => changePage('paste')} />
      </Menu>
      {(page === undefined || page === 'lock') && <Lock/>}
      {page === 'effect' && <RxGround/> }
      {page === 'buffer' && <Buffer/>}
      {page === 'press' && <RandomPress/>}
      {page === 'paste' && <Paste/>}
      {page === 'play' && <Play/>}
      {page === 'table' && <Table/>}
    </div>
  )
}

export {
  App
}
