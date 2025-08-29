import { defineConfig } from '@rsbuild/core'
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'
import { pluginReact } from '@rsbuild/plugin-react'

export default {
  ...defineConfig({
    plugins: [pluginReact(), pluginNodePolyfill()],
    html: {
      template: './index.html',
    },
  }),
  // defaultEntry: {
  //   index: './src/svg-simple.ts'
  // }
}
