// generatePathMap(deepObjects)

// const deepObjectUpdate = (obj, path, value) => {
// const ss = path.split(':')
// let current = obj[ss[0]]
// if (current !== undefined) {
// for (let i = 1; i < ss.length; i++) {
// current = current[ss[i]]
// }
// }
// }
//
//
// console.log(detectWhichPath(deepObject, 'ccc'))
// const finalPath = detectWhichPath(deepObject, 'ccc')
// console.log(finalPath)
// deepObjectUpdate2(deepObject, 'ccc', 'kk', finalPath)
// console.log(deepObject)

// const cc = deepObject.c.cc.ccc
/// /let ccc = cc.ccc
/// /
// deepObject.c.cc.ccc = 1

// ccc = 1
// console.log(deepObject)

// 测试普通对象的创建速度
const itemNum = 10000


// 测试类实例的创建速度
class MyClass {
  constructor () {
    this.a = 1
    this.b = 2
    this.c = 3
    this.d = 4
    this.e = 5
    this.f = 6
    this.g = 7
    this.h = 8
    this.i = 9
    this.j = 10
  }
}
console.time('Class')
for (let i = 0; i < itemNum; i++) {
  const instance = new MyClass()
}
console.timeEnd('Class')

console.time('Object')
for (let i = 0; i < itemNum; i++) {
  const obj = { a: 1, b: 2, c:3, d:4,e:5,f:6,g:7,h:8,i:9,j:10 }
}
console.timeEnd('Object')

console.time('Class')
for (let i = 0; i < itemNum; i++) {
  const instance = new MyClass()
}
console.timeEnd('Class')

console.time('Object')
for (let i = 0; i < itemNum; i++) {
  const obj = { a: 1, b: 2, c:3, d:4,e:5,f:6,g:7,h:8,i:9,j:10 }
}
console.timeEnd('Object')
// 类方法调用
// class MyClass {
//   method() {}
// }
// const instance = new MyClass();
// console.time('Class method');
// for (let i = 0; i < itemNum; i++) {
//   instance.method();
// }
// console.timeEnd('Class method');
//
// // 普通对象方法调用
// const obj = {
//   method() {}
// };
// console.time('Object method');
// for (let i = 0; i < itemNum; i++) {
//   obj.method();
// }
// console.timeEnd('Object method');
//
