import { useState, useEffect } from "react"
export const useRepeat = (repeatNum:number,f:any)=>{
  const [canRepeat, setCanRepeat] = useState(false)
  const [rn, setRn] = useState(repeatNum)
  useEffect(() => {
    if(canRepeat){
      if(rn>0){
        f.mainTest()
        setRn(rn-1)
      }else{
        console.log('string size 10*1024*1024',)
        console.log('repeatTimes',repeatNum)
        f.testResult()
      }
    }
  }, [rn, canRepeat])
  return{setCanRepeat}
}
