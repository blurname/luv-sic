import {Dictionary, SafeDictionary} from "ts-essentials";
type Abc = 'a'|'b'|'c'
const u = {
  name:'a',
  age: 123,
  type: 'human'
}
type tu = typeof u
type KAbc<T> = {[key in keyof T]?:T[key]}
const t:KAbc<typeof u> = {'name':'asdl;fkj'}

const stringDict: Dictionary<string, string> = {
  bao: 'b',
  123: 'l'
}
console.log(stringDict.bao)
const safeStringDict: SafeDictionary<string, string> ={
  bao: 'a',
  123: 's'
}
//console.log(safeStringDict.)
