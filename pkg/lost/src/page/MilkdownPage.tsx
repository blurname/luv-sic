import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'

import { history } from '@milkdown/kit/plugin/history'
import React from 'react'

const MilkdownEditor: React.FC = () => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, 'asdf')
      })
      .use(commonmark)
      .config((ctx) => {
        const listener = ctx.get(listenerCtx)

        listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            console.log('🟦[blue]->markdown: ', markdown)
            // YourMarkdownUpdater(markdown)
          }
        })
      })
      .use(listener)
      .use(history)
  )
  const editor = get()
  editor?.onStatusChange((i) => {
    console.log(i)
  })

  return <Milkdown />
}

export const MilkdownPage: React.FC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  )
}
