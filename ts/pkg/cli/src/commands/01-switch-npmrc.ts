import { access } from 'node:fs/promises'
import { execSync } from 'node:child_process'
const switchNpmrcDesc = 'to switch weather use user .npmrc'
const switchNpmrc = async () => {
  const homePath = process.env.HOME
  try {
    await access(`${homePath}/.npmrc`)
    execSync(`mv ${homePath}/.npmrc ${homePath}/.npmrb`)
    console.log('switch .npmrc to .npmrb')
  } catch (error) {
    await access(`${homePath}/.npmrb`)
    execSync(`mv ${homePath}/.npmrb ${homePath}/.npmrc`)
    console.log('switch .npmrb to .npmrc')
  }
}
export { switchNpmrc, switchNpmrcDesc }
// switchNpmrc()
