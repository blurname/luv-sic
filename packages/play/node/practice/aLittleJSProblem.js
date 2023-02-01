// problem source
// https://lisperator.net/blog/a-little-javascript-problem/
// need a index to map()
// range is a F to struct like chuch num, it must has a variable to travl the list, maybe the `step`
// type Fn = (...args:any[]) => any
// const range = (begin: number,end: number, step = 1) => begin <= end ? (fn:Fn) => { fn(begin); return range(begin+step,end) } : end
// //let numbers = range(1, 10);
// const a = [1,2,3]
// console.log(a.map(n=>({'key':n})))
// f : a -> b
// map: f M a -> M f a
//const map = (v,fn) => {
//let a = v
//while(typeof a === 'function'){
//a = a(fn)
//}
//}
//numbers = map(numbers, function (n) { return n * n });
// foreach: f M a -> M f a
//const foreach = (v,fn) => {
//let a = v
//while(typeof a === 'function'){
//a = a(fn)
//}
//}
// reverse: f M a -> M f a
//
//foreach(numbers, console.log);
//numbers = reverse(numbers);
//2022.7.23
// v2
const range = (begin, end, acc) => {
    return (f, acc) => {
        if (begin === end)
            return range(end - begin, end, acc);
        return range(begin + 1, end, acc + f(begin + 1));
    };
};
const numbers = range(1, 10);
const map = (numbers, f) => {
    return numbers(f);
};
// 要怎么做呢，range 的结果只会在计算时候知道，要怎么把它反过来呢
const revert = (numbers) => { };
const foreach = (numbers, f) => {
    numbers(any);
};
export {};
