const optionData = [
  {
    data: { name: '标题3', linkCids: 'asdfas', expanded: true, selected: true },
    children: [
      {
        data: {
          name: '标题31',
          linkCids: 'zxcvxzcv',
          expanded: true,
          selected: false,
        },
        children: [
          {
            data: {
              name: '标题311',
              linkCids: 'qwer',
              expanded: true,
              selected: false,
            },
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
        data: {
          name: '标题21',
          linkCids: 'xcvb',
          expanded: true,
          selected: false,
        },
        children: [],
      },
      {
        data: {
          name: '标题22',
          linkCids: 'asdfzxc',
          expanded: true,
          selected: false,
        },
        children: [],
      },
    ],
  },
  {
    data: {
      name: '标题1',
      linkCids: 'dfghdfgh',
      expanded: true,
      selected: false,
    },
    children: [
      {
        data: {
          name: '标题11',
          linkCids: 'zxcvxzcv',
          expanded: true,
          selected: false,
        },
        children: [
          {
            data: {
              name: '标题111',
              linkCids: 'qwer',
              expanded: true,
              selected: false,
            },
            children: [],
          },
        ],
      },
      {
        data: {
          name: '标题12',
          linkCids: 'zxcvxzcv',
          expanded: true,
          selected: false,
        },
        children: [
          {
            data: {
              name: '标题121',
              linkCids: 'qwer',
              expanded: true,
              selected: false,
            },
            children: [
              {
                data: {
                  name: '标题1211',
                  linkCids: 'qwer',
                  expanded: true,
                  selected: false,
                },
                children: [],
              },
            ],
          },
          {
            data: {
              name: '标题      122',
              linkCids: 'qwer',
              expanded: true,
              selected: false,
            },
            children: [],
          },
          {
            data: {
              name: '标题123',
              linkCids: 'qwer',
              expanded: true,
              selected: false,
            },
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
export type OptionDataP2 = {
  da: {
    na: string
    de?: boolean
    e: boolean
    lc: string
    sd: boolean
    ico?: { path: string; viewBox: string }
  }
  chi: OptionDataP2[]
}

const dataDatapMap = {
  data: 'da',
  name: 'na',
  designExpanded: 'de',
  expanded: 'e',
  linkCids: 'lc',
  selected: 'sd',
  icon: 'ico',
  children: 'chi',
} as const

const zipData3 = (od: OptionData): OptionDataP2 | undefined => {
  if (od.data === undefined) return undefined
  const da = Object.entries(od.data).reduce((pre, [k, v]) => {
    return {
      ...pre,
      [dataDatapMap[k]]: v,
    }
  }, {})
  return {
    da,
    chi: od.children.map(zipData3),
  }
}

console.log(optionData.map(zipData3))
export type OptionDataP = {
  d: string
}

//const zipData = (optionData) => {
//const d = Object.values(optionData.data)
//.map((v) => {
//if (typeof v === 'boolean') return v ? 't' : 'f'
//else if (typeof v === 'string') return v

//const realV = v
//// object -> icon
//return [realV?.path, realV?.viewBox].join('\x02')
//})
//.join('\x01')
//let cd
//if (optionData.children.length === 0) {
//cd = []
//} else {
//cd = optionData.children.map(zipData).reduce((sum, cur) => cur + sum, '') // remove the comman in array
//// cd = optionData.children.map(zipData)
//}
//const r = [d, cd].join('"') // '"' split the data and children
//if (cd.length === 0) {
//return `!${r}` // '!' as the call end
//}
//return r
//}

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

//const a = optionData.map((s) => JSON.stringify(s.data) + JSON.stringify(s.children)).join(' ')
//console.log(a.split(' '))

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
