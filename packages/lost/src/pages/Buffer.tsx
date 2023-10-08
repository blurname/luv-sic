import React, { KeyboardEventHandler, useCallback, useEffect } from 'react'
import keys, { Callback } from 'ctrl-keys'
import { Remesh } from 'remesh'
import { useRemeshDomain, RemeshRoot, useRemeshQuery, useRemeshSend } from 'remesh-react'
import { BufferDomain } from '../domain/Buffer.js'
import { StyledBuffer, StyledBufferList, StyledEditor } from './styles.js'
import { BufferRepoExternImpl } from '../domain/localforage-extern.js'
import Editor from '@monaco-editor/react'

const handler = keys()

const BufferContent = () => {
  const domain = useRemeshDomain(BufferDomain())
  const send = useRemeshSend()

  const onClick = (key:string) => (e:any) => {
    send(domain.command.UpdateActiveBufferCommand(key))
  }

  const bufferList = useRemeshQuery(domain.query.BufferListQuery())
  const activeBuffer = useRemeshQuery(domain.query.ActiveBufferQuery())

  // const onKeyUp:KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
  //   send(domain.command.UpdateBufferContentCommand({ key: activeBuffer?.key, content: e.currentTarget.value }))
  // }
  //
  // const onBlur:React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
  //   send(domain.command.UpdateBufferContentCommand({ key: activeBuffer?.key, content: e.currentTarget.value }))
  // }

  const handleDelete = (key:string):React.MouseEventHandler<HTMLDivElement> => (e) => {
    send(domain.command.DelBufferCommand(key))
  }

  const handleNewBuffer = () => {
    send(domain.command.AddBufferCommand())
  }

  // const Editor = useCallback(() => {
  //   if (activeBuffer?.key) {
  //     return (
  //     <StyledEditor
  //       onKeyUp={onKeyUp}
  //       onBlur={onBlur}
  //       onClick={onBlur}
  //       defaultValue={activeBuffer?.content}
  //     />
  //     )
  //   }
  //   return null
  // }, [activeBuffer?.key])

  useEffect(() => {
    const handleAdd:Callback = (e) => {
      e?.preventDefault()
      send(domain.command.AddBufferCommand())
    }

    const handleDelete:Callback = (e) => {
      e?.preventDefault()
      send(domain.command.DelBufferCommand(activeBuffer?.key))
    }

    const handleNextBuffer = (e) => {
      e?.preventDefault()
      send(domain.command.UpdateActiveBufferByDirectionCommand('next'))
    }

    const handlePrevBuffer = (e) => {
      e?.preventDefault()
      send(domain.command.UpdateActiveBufferByDirectionCommand('prev'))
    }

    handler
      .add('ctrl+n', handleAdd)
      .add('ctrl+w', handleDelete)
      .add('ctrl+pagedown', handleNextBuffer)
      .add('ctrl+pageup', handlePrevBuffer)
    const combo = (e:KeyboardEvent) => {
      handler.handle(e)
    }
    document.addEventListener('keydown', combo)
    return () => {
      handler
        .remove('ctrl+n', handleAdd)
        .remove('ctrl+w', handleDelete)
        .remove('ctrl+pagedown', handleNextBuffer)
        .remove('ctrl+pageup', handlePrevBuffer)
      document.removeEventListener('keydown', combo)
    }
  }, [activeBuffer?.key])

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
              $isactive={t.key === activeBuffer?.key}
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
      <BufferEditor dv={activeBuffer?.content} bufferKey={activeBuffer?.key} />
      {/* <Editor/> */}
      </>
  )
}

function BufferEditor ({ dv, bufferKey }) {
  const domain = useRemeshDomain(BufferDomain())
  const send = useRemeshSend()
  function handleEditorChange (value, event) {
    // console.log(value)
    // here is the current value

    send(domain.command.UpdateBufferContentCommand({ key: bufferKey, content: value }))
  }

  function handleEditorDidMount (editor, monaco) {
    console.log('onMount: the editor instance:', editor)
    console.log('onMount: the monaco instance:', monaco)
  }

  function handleEditorWillMount (monaco) {
    console.log('beforeMount: the monaco instance:', monaco)
  }

  function handleEditorValidation (markers) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="Markdown"
      value={dv}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorWillMount}
      onValidate={handleEditorValidation}
      theme="light"
    />
  )
}

const Buffer = () => {
  const store = Remesh.store({
    externs: [BufferRepoExternImpl]
  })

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
