const now = Date.now()
const sMS = () => {
  return 1000
}
const minuteMs = () =>{
  return 60 *sMS()
}
const hourMs = () => {
  return 60 * minuteMs()
}
const dayMs = () => {
  return 24 * hourMs()
}
const weekMs = () => {
  return 7 * dayMs()
}

type MsFormat = 's' | 'minute' | 'hour' | 'day' | 'week'
type TimestampOrDate = number | string | Date
export class BLTime {
  private date: number
  constructor(timestampOrdate:TimestampOrDate){
    if(typeof timestampOrdate === 'number'){
      this.date = timestampOrdate
    }else{
      this.date = new Date(timestampOrdate).getTime()
    }
    return this
  }
  isBefore(date: string|Date){
    return this.date < new Date(date).getTime() 
  }
  isAfter(date: string|Date){
    return this.date > new Date(date).getTime() 
  }
  isEqual(date: string|Date){
    return this.date === new Date(date).getTime()
  }
  diffDays(comparedTime: BLTime){
    return Math.ceil((this.date - comparedTime.date) / dayMs())
  }
  // currently not supported month
  add(num:number, MsFormat: MsFormat){
    let addedMs = 0
    if (MsFormat === 's'){
      addedMs = num * sMS()
    } else if( MsFormat === 'minute'){
      addedMs = num * minuteMs()
    } else if( MsFormat === 'hour'){
      addedMs = num * hourMs()
    } else if (MsFormat === 'day'){
      addedMs = num * dayMs()
    } else if (MsFormat === 'week'){
      addedMs = num * weekMs()
    } else {

    }
    return new BLTime(this.date + addedMs)
  }
  sub(num:number, MsFormat: MsFormat){
    let subedMs = 0
    if (MsFormat === 's'){
      subedMs = num * sMS()
    } else if( MsFormat === 'minute'){
      subedMs = num * minuteMs()
    } else if( MsFormat === 'hour'){
      subedMs = num * hourMs()
    } else if (MsFormat === 'day'){
      subedMs = num * dayMs()
    } else if (MsFormat === 'week'){
      subedMs = num * weekMs()
    } else {

    }
    return new BLTime(this.date + subedMs)
  }
}

const time = '2022-05-27T11:47:55.000+08:00'
console.log(new Date(time).getTime())
console.log(new BLTime(time).add(1,'s').add(1,'s'))
console.log(new BLTime(time).diffDays(new BLTime(Date.now())))

const hour = (timestamp:number)=> Math.floor(timestamp /1000 /60 /60)

const day = (timestamp:number)=>Math.floor(timestamp /1000 /60 /60/24)

//console.log(date)

//console.log(hour(date))
//console.log(day(now)-day(date))
//console.log(now-date)
//console.log(date>now)
//console.log(date<now)
//console.log(date>now)
