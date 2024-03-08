import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default {
  ...defineConfig({
    plugins: [pluginReact()]
  }),
  defaultEntry: {
    index: './src/App.tsx'
  }
}
