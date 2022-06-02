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
//

type PropEventSource<T> = {
    on<K extends string & keyof T>
        (eventName: `${K}Changed`, callback: (newValue: T[K]) => void ): void;
};
 
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
 
let person = makeWatchedObject({
    firstName: "Homer",
    age: 42,
    location: "Springfield",
});
 
// works! 'newName' is typed as 'string'
person.on("firstNameChanged", newName => {
    // 'newName' has the type of 'firstName'
    console.log(`new name is ${newName.toUpperCase()}`);
});
 
// works! 'newAge' is typed as 'number'
person.on("ageChanged", newAge => {
    if (newAge < 0) {
        console.log("warning! negative age");
    }
})
