import React, { useEffect, useRef, useState } from 'react';
import { Observable, switchMap, fromEvent, interval, map, take, concat, filter } from 'rxjs';
export function Elevator() {
    const [floor] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const elevatorRef = useRef(null);
    const [elevatorState, setElevatorState] = useState({
        currentFloor: 1,
        direction: 'stop',
        clickedFloors: [],
    });
    useEffect(() => {
        elevator(elevatorRef.current).subscribe((x) => {
            const isStop = x.currentFloor === 1;
            setElevatorState({
                currentFloor: x.currentFloor,
                direction: isStop ? 'stop' : x.direction,
                clickedFloors: isStop ? [] : x.clickedFloors,
            });
        });
    }, []);
    const changeFloor = ({ targetFloor }) => {
        const ne = Object.assign(new Event('click'), {
            targetFloor,
            currentFloor: elevatorState.currentFloor,
            direction: elevatorState.direction,
            clickedFloors: elevatorState.clickedFloors,
        });
        elevatorRef.current.dispatchEvent(ne);
    };
    return (<div style={{ display: 'flex', flexDirection: 'column', width: 200, background: '#f002' }}>
      {floor.map((n, i) => (<button key={i} onClick={() => changeFloor({ targetFloor: n })}>
          {n}
        </button>))}
      <span>currentFloor: {elevatorState.currentFloor}</span>
      <span>direction: {elevatorState.direction}</span>
      <div style={{ display: 'none' }} ref={elevatorRef}/>
    </div>);
}
const elevator = (ref) => {
    return fromEvent(ref, 'click').pipe(filter(({ targetFloor, currentFloor, direction }) => {
        if (direction === 'down')
            return false;
        else if (direction === 'up' && currentFloor > targetFloor)
            return false;
        return true;
    }), switchMap(({ targetFloor, currentFloor, clickedFloors }) => {
        const maxFloor = getMaxClickedFloors(clickedFloors, targetFloor);
        console.log(maxFloor);
        const down = interval(1000).pipe(take(maxFloor), map((x) => ({
            currentFloor: maxFloor - x,
            direction: 'down',
            clickedFloors: [...clickedFloors, targetFloor],
        })));
        const up = interval(1000).pipe(take(maxFloor - currentFloor + 1), map((x) => ({
            currentFloor: x + currentFloor,
            direction: 'up',
            clickedFloors: [...clickedFloors, targetFloor],
        })));
        return concat(up, down);
    }));
};
const getMaxClickedFloors = (floors, currentFloor) => {
    let curMaxFloor = -1;
    floors.forEach((n) => {
        if (n > curMaxFloor)
            curMaxFloor = n;
    });
    return curMaxFloor > currentFloor ? curMaxFloor : currentFloor;
};
// 如果 subscribe，那么就会跑一次完整的函数 callback,
// subscribe 里的 args ，只是对应 recive 对应 action notifaction
const observable = new Observable((subscriber) => {
    let a = 0;
    subscriber.next(a++);
    subscriber.next(a++);
    subscriber.next(a++);
    subscriber.next(a++);
    // 如果 complete，接下去的 complete 就不会执行
    setTimeout(() => {
        subscriber.next(a++);
        subscriber.complete();
    }, 1000);
});
