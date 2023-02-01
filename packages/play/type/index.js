const u = {
    name: 'a',
    age: 123,
    type: 'human'
};
const t = { 'name': 'asdl;fkj' };
const stringDict = {
    bao: 'b',
    123: 'l'
};
console.log(stringDict.bao);
const safeStringDict = {
    bao: 'a',
    123: 's'
};
export {};
//declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
//let person = makeWatchedObject({
//firstName: "Homer",
//age: 42,
//location: "Springfield",
//});
//// works! 'newName' is typed as 'string'
//person.on("firstNameChanged", newName => {
//// 'newName' has the type of 'firstName'
//console.log(`new name is ${newName.toUpperCase()}`);
//});
//// works! 'newAge' is typed as 'number'
//person.on("ageChanged", newAge => {
//if (newAge < 0) {
//console.log("warning! negative age");
//}
//})
