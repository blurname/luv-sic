import React, { useMemo } from 'react'
import { cells, heightList, table, widthList } from './tableConstant'
import './table.css'

// const TableTable = () => {
//   const colGroupRender = useMemo(() => {
//     return widthList.map((width, index) => {
//       return <col key={index} width={width} />
//     })
//   }, [])
//   const contentRenderer = useMemo(() => {
//     return table.map((row, x) => {
//       const height = heightList[x]
//       return <tr key={x} data-y={x} style={{ height }}>
//         {
//           row.map((cellKey, y) => {
//             const cell = cells[cellKey]
//             const width = widthList[y]
//             return <td
//             className="td"
//             style={{ height, width, overflow: 'hidden' }}
//             dangerouslySetInnerHTML={{ __html: cell.data }}
//             />
//           })
//         }
//       </tr>
//     })
//   }, [])
//   return (
//   <table className="table">
//   <colgroup>
//   {colGroupRender}
//   </colgroup>
//   <tbody>
//
//   {contentRenderer}
//   </tbody>
// </table>
//   )
// }
const DivTable = () => {
  const contentRenderer = useMemo(() => {
    return table.map((row, x) => {
      const height = heightList[x]
      // return  //<div className="tr" key={x} data-y={x} style={{ height, display: 'flex' }}>
      return row.map((cellKey, y) => {
        let className = 'td'
        if (x === 2 && y === 2) {
          className += ' cross'
        }
        const cell = cells[cellKey]
        const width = widthList[y]
        return <div
            className={className}
            style={{ width }}
            dangerouslySetInnerHTML={{ __html: cell.data }}
            />
      })
      // </div>
    })
  }, [])
  let gtc = ''
  for (const width of widthList) {
    gtc += `${width}px `
  }
  // grid-template-columns
  const totalWidth = widthList.reduce((pre, cur) => pre + cur, 0)
  console.log('🟦[blue]->totalWidth: ', totalWidth)
  const style = {
    width: totalWidth,
    marginTop: 2,
    gridTemplateColumns: gtc
  }
  console.log('🟦[blue]->gtc: ', gtc)
  return <div className="table" style={style}>
  {contentRenderer}
  </div>
}

const Table = () => {
  return (
      <>
      {/* <TableTable/> */}
      <DivTable/>
      </>
  )
}
export {
  Table
}
