import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default {
  ...defineConfig({
    plugins: [pluginReact()]
  }),
  server: {
    port: 1231
  },
  defaultEntry: {
    index: './src/App.tsx'
  },
  html: {
    title: 'ui-dev',
    favicon: './public/dear.png'
  }
}
