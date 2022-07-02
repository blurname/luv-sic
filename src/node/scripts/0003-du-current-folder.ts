import {log} from 'node:console'
import { exec } from '../core'
// list current folder's nodes' size
const duCurrentFolder = async() =>{
  const {stdout} = await exec(`ls`)
  const files = stdout.split('\n').filter(n=>n!=='')

  // get filesize
  const fileSizes = files.map(async n=>{
    const {stdout:size} = await exec(`du -sh ${n}`)
    return size
  })

  // log them
  fileSizes.forEach(async (n) => {
    const size = await n
    console.log(size.split('\n')[0])
  })

}
duCurrentFolder()
export {
  duCurrentFolder
}
