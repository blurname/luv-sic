const optionData = [
  {
    data: { name: '标题3', linkCids: 'asdfas', expanded: true, selected: true },
    children: [
      {
        data: { name: '标题31', linkCids: 'zxcvxzcv', expanded: true, selected: false },
        children: [
          {
            data: { name: '标题311', linkCids: 'qwer', expanded: true, selected: false },
            children: [],
          },
        ],
      },
    ],
  },
  {
    data: { name: '标题2', linkCids: 'sadf', expanded: true, selected: false },
    children: [
      {
        data: { name: '标题21', linkCids: 'xcvb', expanded: true, selected: false },
        children: [],
      },
      {
        data: { name: '标题22', linkCids: 'asdfzxc', expanded: true, selected: false },
        children: [],
      },
    ],
  },
  {
    data: { name: '标题1', linkCids: 'dfghdfgh', expanded: true, selected: false },
    children: [
      {
        data: { name: '标题11', linkCids: 'zxcvxzcv', expanded: true, selected: false },
        children: [
          {
            data: { name: '标题111', linkCids: 'qwer', expanded: true, selected: false },
            children: [],
          },
        ],
      },
      {
        data: { name: '标题12', linkCids: 'zxcvxzcv', expanded: true, selected: false },
        children: [
          {
            data: { name: '标题121', linkCids: 'qwer', expanded: true, selected: false },
            children: [
              {
                data: { name: '标题1211', linkCids: 'qwer', expanded: true, selected: false },
                children: [],
              },
            ],
          },
          {
            data: { name: '标题      122', linkCids: 'qwer', expanded: true, selected: false },
            children: [],
          },
          {
            data: { name: '标题123', linkCids: 'qwer', expanded: true, selected: false },
            children: [],
          },
        ],
      },
    ],
  },
]

export type OptionData = {
  data: {
    name: string
    designExpanded?: boolean
    expanded: boolean
    linkCids: string
    selected: boolean
    icon?: { path: string; viewBox: string }
  }
  children: OptionData[]
}
export type OptionDataP = {
  d: string
}
const zipData = (optionData) => {
  const d = Object.values(optionData.data)
    .map((v) => {
      if (typeof v === 'boolean') return v ? 't' : 'f'
      else if (typeof v === 'string') return v

      const realV = v
      // object -> icon
      return [realV?.path, realV?.viewBox].join('\x02')
    })
    .join('\x01')
  let cd
  if (optionData.children.length === 0) {
    cd = []
  } else {
    cd = optionData.children.map(zipData).reduce((sum, cur) => cur + sum, '') // remove the comman in array
    // cd = optionData.children.map(zipData)
  }
  const r = [d, cd].join('"') // '"' split the data and children
  if (cd.length === 0) {
    return `!${r}` // '!' as the call end
  }
  return r
}

// const zipData2 = (optionData) => {
//   const d = [
//     Object.values(optionData.data).map((v) => {
//       if (typeof v === 'boolean') return v ? 't' : 'f'
//       else if (typeof v === 'string') return v

//       const realV = v
//       // object -> icon
//       return [realV?.path, realV?.viewBox].join('\x02')
//     }),
//   ].join('\x01')
//   let cd
//   if (optionData.children.length === 0) {
//     cd = []
//   } else {
//     cd = optionData.children.map(zipData).reduce((sum, cur) => cur + sum, '') // remove the comman in array
//     // cd = optionData.children.map(zipData)
//   }
//   const r = [d, cd].join('"') // '"' split the data and children
//   if (cd.length === 0) {
//     return `!${r}` // '!' as the call end
//   }
//   return r
// }

const a = optionData.map((s) => JSON.stringify(s.data) + JSON.stringify(s.children)).join(' ')
console.log(a.split(' '))

// const result = optionData.map(zipData).join('\0')
// console.log(result)
// const all = result.split('\0')
// console.log(all)
// const parse = (optiondataP: string) => {
//   console.log(optiondataP.split('"'))
// }
// parse(all[0])
// parse(all[1])
// parse(all[2])
// const
