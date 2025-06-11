import { Editor, rootCtx, defaultValueCtx, editorViewCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { $useKeymap, $command } from '@milkdown/utils'
import { commandsCtx } from '@milkdown/core'

import { history } from '@milkdown/kit/plugin/history'

import { redoDepth, undoDepth } from '@milkdown/kit/prose/history'
import React, { useEffect } from 'react'

const customCommand = $command('CustomCommand', (ctx) => () => {
  return (state, dispatch) => {
    console.log('ctrl+s')
    // Command implementation
    return true
  }
})
const MilkdownEditor: React.FC = () => {
  const customKeymap = $useKeymap('customKeymap', {
    CustomCommand: {
      shortcuts: 'Mod-s',
      command: (ctx) => {
        const commands = ctx.get(commandsCtx)
        console.log('Mod+s')
        return () => commands.call(customCommand.key)
      }
    }
  })

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, a.docText)
      })
      .use(commonmark)
      .use(customCommand)
      .use(customKeymap)
      .config((ctx) => {
        const listener = ctx.get(listenerCtx)

        listener.markdownUpdated(async (ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            const view = ctx.get(editorViewCtx)
            // const a = await historyProviderPlugin(ctx)
            // const a = await (await editorState(ctx))()
            console.log('🟦[blue]->markdown: ', undoDepth(view.state), redoDepth(view.state))
            // YourMarkdownUpdater(markdown)
          }
        })
      })
      .use(listener)
      .use(history)
  )
  const editor = get()!

  return <div>
  <div></div>
  <div></div>
  <Milkdown />
  </div> 
}

export const MilkdownPage: React.FC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  )
}
