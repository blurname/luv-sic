//import * as ts from 'typescript'
const testTime = (cb) => {
    const startTime = performance.now();
    cb();
    const endTime = performance.now();
    console.log(`${endTime - startTime} ms`);
};
const loop1000 = () => {
    let a = new Array(2000).fill({ a: 1, b: 2, c: 3 });
    a.forEach((_, index) => console.log(index));
};
testTime(loop1000);
export {};
