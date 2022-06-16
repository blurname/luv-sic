// @errors: 2345
//type PropEventSource<Type> = {
  //on(eventName: `${string & keyof Type}Changed`, callback: (newValue: Type) => void): void;
//};

//declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
//// ---cut---
//const person = makeWatchedObject({
//firstName: "Saoirse",
//lastName: "Ronan",
//age: 26
//});

//person.on("firstNameChanged", () => {});

//// Prevent easy human error (using the key instead of the event name)
//person.on("firstName", () => {});

//// It's typo-resistant
//person.on("frstNameChanged", () => {});
export {

}
