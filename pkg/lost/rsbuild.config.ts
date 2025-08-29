import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default {
  ...defineConfig({
    plugins: [pluginReact()],
  }),
  server: {
    port: 1230,
  },
  defaultEntry: {
    index: './src/App.tsx',
  },
  html: {
    title: '追忆',
    favicon: './public/dear.png',
  },
}
