import React, { useEffect } from 'react'
import keys, { Callback } from 'ctrl-keys'
import { Remesh } from 'remesh'
import { useRemeshDomain, RemeshRoot, useRemeshQuery, useRemeshSend } from 'remesh-react'
import { BufferDomain } from '../domain/Buffer'
import { StyledBuffer, StyledBufferList } from './styles'
import { BufferRepoExternImpl } from '../domain/localforage-extern'
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
    const handleShareContent = (e) => {
      navigator.clipboard.writeText(location.href)
    }

    handler
      .add('ctrl+n', handleAdd)
      .add('ctrl+w', handleDelete)
      .add('ctrl+pagedown', handleNextBuffer)
      .add('ctrl+pageup', handlePrevBuffer)
      .add('ctrl+b', handleShareContent)

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
        .remove('ctrl+b', handleShareContent)
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

    location.hash = encodeURIComponent(value || '') //  // Math.random().toString()
    send(domain.command.UpdateBufferContentCommand({ key: bufferKey, content: value }))
  }

  function handleEditorDidMount (editor, monaco) {
    console.log('onMount: the editor instance:', editor)
    console.log('onMount: the monaco instance:', monaco)
  }

  function handleEditorWillMount (monaco) {
    console.log('beforeMount: the monaco instance:', monaco)

    monaco.editor.defineTheme('nord', nordThemeData)
    // monaco.editor.setTheme('nord')
  }

  function handleEditorValidation (markers) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }

  console.log('🟦[blue]->dv: ', dv)
  return (
    <Editor
      height="90vh"
      defaultLanguage="markdown"
      value={dv}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorWillMount}
      onValidate={handleEditorValidation}
      // theme="nord"
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

const nordThemeData = {
  'base': 'vs-dark',
  'inherit': true,
  'rules': [
    {
      'background': '2E3440',
      'token': ''
    },
    {
      'foreground': '616e88',
      'token': 'comment'
    },
    {
      'foreground': 'a3be8c',
      'token': 'string'
    },
    {
      'foreground': 'b48ead',
      'token': 'constant.numeric'
    },
    {
      'foreground': '81a1c1',
      'token': 'constant.language'
    },
    {
      'foreground': '81a1c1',
      'token': 'keyword'
    },
    {
      'foreground': '81a1c1',
      'token': 'storage'
    },
    {
      'foreground': '81a1c1',
      'token': 'storage.type'
    },
    {
      'foreground': '8fbcbb',
      'token': 'entity.name.class'
    },
    {
      'foreground': '8fbcbb',
      'fontStyle': '  bold',
      'token': 'entity.other.inherited-class'
    },
    {
      'foreground': '88c0d0',
      'token': 'entity.name.function'
    },
    {
      'foreground': '81a1c1',
      'token': 'entity.name.tag'
    },
    {
      'foreground': '8fbcbb',
      'token': 'entity.other.attribute-name'
    },
    {
      'foreground': '88c0d0',
      'token': 'support.function'
    },
    {
      'foreground': 'f8f8f0',
      'background': 'f92672',
      'token': 'invalid'
    },
    {
      'foreground': 'f8f8f0',
      'background': 'ae81ff',
      'token': 'invalid.deprecated'
    },
    {
      'foreground': 'b48ead',
      'token': 'constant.color.other.rgb-value'
    },
    {
      'foreground': 'ebcb8b',
      'token': 'constant.character.escape'
    },
    {
      'foreground': '8fbcbb',
      'token': 'variable.other.constant'
    }
  ],
  'colors': {
    'editor.foreground': '#D8DEE9',
    'editor.background': '#2E3440',
    'editor.selectionBackground': '#434C5ECC',
    'editor.lineHighlightBackground': '#3B4252',
    'editorCursor.foreground': '#D8DEE9',
    'editorWhitespace.foreground': '#434C5ECC'
  }
}

export {
  Buffer
}
