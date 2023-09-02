import React, { KeyboardEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import keys from 'ctrl-keys'
import { Remesh } from 'remesh'
import { useRemeshDomain, RemeshRoot, useRemeshQuery, useRemeshSend } from 'remesh-react'
import { BufferDomain } from '../domain/Buffer.js'
import { StyledBuffer, StyledBufferList, StyledEditor } from './styles.js'

const handler = keys()

const BufferContent = () => {
  const domain = useRemeshDomain(BufferDomain())
  const send = useRemeshSend()

  const onClick = (key:string) => (e:any) => {
    send(domain.command.UpdateActiveBufferCommand(key))
  }

  const bufferList = useRemeshQuery(domain.query.BufferListQuery())
  const activeBuffer = useRemeshQuery(domain.query.ActiveBufferQuery())

  const onKeyUp:KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    // store.updateItem(activeTab, e.currentTarget.value)
  }

  const onBlur:React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
    // store.save(activeTab)
  }

  const handleDelete = (key:string):React.MouseEventHandler<HTMLDivElement> => (e) => {
    send(domain.command.DelBufferCommand(key))
  }

  const handleNewBuffer = () => {
    send(domain.command.AddBufferCommand())
  }

  const Editor = useCallback(() => {
    return (
      <StyledEditor
      onKeyUp={onKeyUp}
      onBlur={onBlur}
      onClick={onBlur}
      style={{ flex: 1 }}
      defaultValue={activeBuffer?.content}
      />
    )
  }, [activeBuffer])

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
      <StyledBufferList>
      {bufferList.map((t) => {
        return (
            <StyledBuffer
              key={t.key}
              isactive={t.key === activeBuffer?.key}
              >
              <span
              onClick={onClick(t.key)}
              >{t.key}</span>
              <div className="del-btn" onClick={handleDelete(t.key)}>x</div>
              <div className="divider" />
              </StyledBuffer>
        )
      })}
      <div className="add-btn" onClick={handleNewBuffer} >+</div>
      </StyledBufferList>
      <Editor/>
      </>
  )
}

const Buffer = () => {
  const store = Remesh.store()

  return (
    <RemeshRoot store={store}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BufferContent />
      </div>
    </RemeshRoot>
  )
}

export {
  Buffer
}
