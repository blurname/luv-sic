import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default {
  ...defineConfig({
    plugins: [pluginReact()]
  }),
  server: {
    port: 1230,
    proxy: {
      // http://localhost:3000/api -> http://localhost:3000
      // http://localhost:3000/api/foo -> http://localhost:3000/foo
      '/api':{
        target: 'http://localhost:1231',
      },
    },
  },
  defaultEntry: {
    index: './src/App.tsx'
  },
  html: {
    title: '追忆',
    favicon: './public/dear.png'
  }
}
