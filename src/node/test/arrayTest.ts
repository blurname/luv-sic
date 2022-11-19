//const arr = [
//{ type: 'ArtBoardRef', maxIndex: 2 },
//{ type: 'Note', maxIndex: 1 },
//{ type: 'AboardLine', maxIndex: 3 },
//{ type: 'Stamp', maxIndex: 4 },
//]
//for (const [index, value] of arr.entries()) {
//}
//const t = (arr:unknown[]) => {
//let arrIndex = arr[ 0 ].maxIndex
//return () => {
//arrIndex += 1
//console.log(arrIndex)
//}
//}
//const a = t(arr)
//a()
//a()
export {}
// const [ a,b,c,d] = arr
// console.log(a,b,c)
//
//

// benchMark

const startTime = performance.now()
for (let i = 0; i < 1000000000; i++) {
  const a = { x: 1, y: 2 }
}
const endTime = performance.now()
console.log('object', endTime - startTime)
const startTime1 = performance.now()
for (let i = 0; i < 1000000000; i++) {
  const a = [1, 2]
}
const endTime1 = performance.now()
console.log('array', endTime1 - startTime1)
// 测试结束，两者速度并无差别
