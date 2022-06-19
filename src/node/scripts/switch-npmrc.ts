import { exec, access } from '../core'
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
switchNpmrc()
