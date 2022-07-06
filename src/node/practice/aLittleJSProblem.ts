// problem source
// https://lisperator.net/blog/a-little-javascript-problem/
// need a index to map()
// range is a F to struct like chuch num, it must has a variable to travl the list, maybe the `step`
type Fn = (...args:any[]) => any
const range = (begin: number,end: number, step = 1) => begin <= end ? (fn:Fn) => { fn(begin); return range(begin+step,end) } : end

//let numbers = range(1, 10);
const a = [1,2,3]
console.log(a.map(n=>({'key':n})))
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
export {}
