// const [ a,b,c,d] = arr
// console.log(a,b,c)
//
//
// benchMark
// 1. 创建对象快还是数组快
//const startTime = performance.now()
//for (let i = 0; i < 1000000000; i++) {
//const a = { x: 1, y: 2 }
//}
//const endTime = performance.now()
//console.log('object', endTime - startTime)
//const startTime1 = performance.now()
//for (let i = 0; i < 1000000000; i++) {
//const a = [1, 2]
//}
//const endTime1 = performance.now()
//console.log('array', endTime1 - startTime1)
// 测试结束，两者速度并无差别
//
// 2. 函数传参, 传对象和直接传参的差别
const test2 = () => {
    const func1 = (p1, p2, p3, p4, p5) => {
        const a = p1;
        const b = p2;
        const c = p3;
        const d = p4;
        const e = p5;
    };
    const func2 = ({ p1, p2, p3, p4, p5 }) => {
        const a = p1;
        const b = p2;
        const c = p3;
        const d = p4;
        const e = p5;
    };
    const obj = () => {
        const startTime2 = performance.now();
        for (let i = 0; i < 100000000; i++) {
            const a = { x: 1, y: 2 };
        }
        const endTime2 = performance.now();
        return endTime2 - startTime2;
    };
    //console.log('object', endTime - startTime)
    const arr = () => {
        const startTime3 = performance.now();
        for (let i = 0; i < 100000000; i++) {
            const a = [1, 2];
        }
        const endTime3 = performance.now();
        //console.log('array', endTime1 - startTime1)
        return endTime3 - startTime3;
    };
    let total1 = 0;
    let total2 = 0;
    for (const iterator of new Array(100)) {
        total1 += obj();
    }
    for (const iterator of new Array(100)) {
        total2 += arr();
    }
    console.log('average', 'obj', total1, 'arr', total2);
};
test2();
export {};
// 结果：没有差别
