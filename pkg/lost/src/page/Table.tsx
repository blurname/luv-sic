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
      return (
        <div
          className="tr"
          key={x}
          data-y={x}
          style={{ height, display: 'flex' }}
        >
          {row.map((cellKey, y) => {
            const cell = cells[cellKey]
            const width = widthList[y]
            return (
              <div
                className="td"
                style={{ width }}
                dangerouslySetInnerHTML={{ __html: cell.data }}
              />
            )
          })}
        </div>
      )
    })
  }, [])
  const totalWidth = widthList.reduce((pre, cur) => pre + cur, 0)
  console.log('🟦[blue]->totalWidth: ', totalWidth)
  return (
    <div className="table" style={{ width: totalWidth, marginTop: 2 }}>
      {contentRenderer}
    </div>
  )
}

const Table = () => {
  return (
    <>
      {/* <TableTable/> */}
      <DivTable />
    </>
  )
}
export { Table }
