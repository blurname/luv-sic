const action1 = {
    value: 1,
    latency: 500,
    log: (v) => {
        console.log(v);
    },
};
const action2 = {
    value: 1,
    latency: 1500,
    log: (v) => {
        console.log(v);
    },
};
const action3 = {
    value: 2,
    latency: 1000,
    log: (v) => {
        console.log(v);
    },
};
const currentLatencyMs = 100000;
const actionList = [];
const a = performance.now();
setTimeout(() => {
    const b = performance.now();
    console.log(Math.round(b - a));
}, 5000);
export {};
