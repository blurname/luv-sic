import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default {
  ...defineConfig({
    plugins: [pluginReact()]
  }),
  defaultEntry: {
    index: './src/App.tsx'
  },
  html: {
    title: '追忆',
    favicon: './public/dear.png'
  }
}
