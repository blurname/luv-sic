//const sMS = () => {
//return 1000
//}
//const minuteMs = () => {
//return 60 * sMS()
//}
//const hourMs = () => {
//return 60 * minuteMs()
//}
//const dayMs = () => {
//return 24 * hourMs()
//}
//const weekMs = () => {
//return 7 * dayMs()
//}
const dateMs = {
    sMs: 1000,
    minuteMs: 60000,
    hourMs: 144000,
    dayMs: 24 * 144000
};
const timeAdd = (previous) => (num, MsFormat) => (previous + BLTime());
const timeDel = (previous) => (num, MsFormat) => ({});
const time;
const BLTime = (t) => ({
    add: () => (BLTime(t) + BLTime(t)),
    value: new Date(t)
});
export {};
