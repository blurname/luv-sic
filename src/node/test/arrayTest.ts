const arr = [
  { type: 'ArtBoardRef', maxIndex: 2 },
  { type: 'Note', maxIndex: 1 },
  { type: 'AboardLine', maxIndex: 3 },
  { type: 'Stamp', maxIndex: 4 }
]
const t = (arr:unknown[]) => {
  let arrIndex = arr[ 0 ].maxIndex
  return () => {
    arrIndex += 1
    console.log(arrIndex)
  }
}
const a = t(arr)
a()
a()
export {

}
// const [ a,b,c,d] = arr
// console.log(a,b,c)
//
