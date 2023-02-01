import { from, filter, switchMap, delay, of, first } from 'rxjs';
const action1 = {
    value: 1,
    latency: 4500,
    log: (v) => {
        console.log(v);
    },
};
const action2 = {
    value: 2,
    latency: 2000,
    log: (v) => {
        console.log(v);
    },
};
const action3 = {
    value: 3,
    latency: 1000,
    log: (v) => {
        console.log(v);
    },
};
let currentLatencyMs = 100000;
const actionList = [];
actionList.push(action1);
const oA = from(actionList).pipe(filter((x) => {
    if (x.latency < currentLatencyMs) {
        currentLatencyMs = x.latency;
        return true;
    }
    return false;
}), switchMap((x) => {
    //delay(x.latency)
    const a = of(x).pipe(delay(x.latency));
    return a;
}), first());
let subject = oA.subscribe();
setTimeout(() => {
    subject.unsubscribe();
    actionList.push(action2);
    subject = oA.subscribe((x) => {
        x.log(x.value);
    });
}, 1000);
setTimeout(() => {
    actionList.push(action3);
    subject.unsubscribe();
    oA.subscribe((x) => {
        x.log(x.value);
    });
}, 1500);
