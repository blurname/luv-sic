const s1 = '<p style="margin-bottom: 0px;">sad</p>'
const s2 = '<p className="asdfasdf" style="margin-bottom: 0px;">sad</p>'
const s3 = '<p style="margin-bottom: 0px;" className="asdfasdf" >sad</p>'
const s4 = '<p className="asdfasdf zxc2134" onclick={asdf} style="margin-bottom: 0px;">sad</p>'
const s5 = '<p style="margin-bottom: 0px;" className="asdfasdf" onclick={asdf} >sad</p>'
const split1 = (s:string) => {
  let realP = s
  const begin = realP.indexOf('="')
  const end = realP.indexOf(';"')
  const styleContent = realP.substring(begin + 2, end + 1) + 'opacity: 0;'
  realP = realP.substring(0, begin + 2) + styleContent + realP.substring(end + 1)
  console.log(realP)
}
//split1(s1)
//split1(s2)
//split1(s3)
//split1(s4)
//split1(s5)

const split2 = (s:string) => {
  
  let realP = s
  const stylePos = realP.indexOf('style="')
  realP = realP.substring(0,stylePos+7) + 'opacity: 0;' + realP.substring(stylePos+7)
  console.log(realP)
}
//const split2 = (s:string) => {
  //let realP = s
   //realP = (realP.substring(0, 2) + ` style="opacity: 0;"` + realP.substring(2))
  //console.log(realP)
//}
split2(s1)
split2(s2)
split2(s3)
split2(s4)
split2(s5)
