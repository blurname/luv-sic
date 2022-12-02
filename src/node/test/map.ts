// 1. know  if map as props is ref propagation
const testMap = new Map<string, number>()
testMap.set('a', 1)
const addLogMap = (map: Map<string, number>, recNum: number) => {
  if (recNum === 5) return
  map.set('a', recNum)
  console.log(testMap.get('a'))
  addLogMap(map, recNum + 1)
}
console.log(testMap.get('a'))
addLogMap(testMap, 2)
console.log(testMap.get('a'))
// resutl: map is ref props
export {}
