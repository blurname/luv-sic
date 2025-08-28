import init, { add_zwsp } from '../../wasm/ZWSP/ZWSP'

async function zwspTest() {
  await init()
  const longString = 'b'.repeat(10 * 1024 * 1024)
  const jsBegin = performance.now()
  const jsResult = longString.split('').join('\u200b')
  const jsEnd = performance.now()
  console.log('js', jsEnd - jsBegin)
  const wasmBegin = performance.now()
  const wasmResult = add_zwsp(longString)
  const wasmEnd = performance.now()
  console.log('wasm', wasmEnd - wasmBegin)
}
zwspTest()
