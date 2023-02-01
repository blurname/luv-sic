import { exec, access } from '@blurkit/core/src/core'
const switchNpmrcDesc = 'to switch weather use user .npmrc'
const switchNpmrc = async () => {
  const homePath = process.env.HOME
  try {
    await access(`${homePath}/.npmrc`)
    await exec(`mv ${homePath}/.npmrc ${homePath}/.npmrb`)
    console.log('switch .npmrc to .npmrb')
  } catch (error) {
    await access(`${homePath}/.npmrb`)
    await exec(`mv ${homePath}/.npmrb ${homePath}/.npmrc`)
    console.log('switch .npmrb to .npmrc')
  }
}
export { switchNpmrc, switchNpmrcDesc }
// switchNpmrc()
