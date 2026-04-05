import { B_ROOT, createTreStore, ItemBase } from '@blurname/core/src/common/treStore'
type NumberCell = {
  key: string
  type: 'cell'
  valueType: 'number'
  value: number
} & ItemBase

type FormulaCell = {
  key: string
  type: 'cell'
  valueType: 'formula'
  value: string
} & ItemBase

type Cell = NumberCell | FormulaCell

const sheetTreStore = createTreStore<Cell>()
const evalCellValue = (cell: Cell) => {
  if (cell.valueType === 'number') return cell.value
  else if (cell.valueType === 'formula') {
    // only plus
    let totalValue = 0
    for (const plusValue of cell.value.split('+').filter(Boolean).map(i => i.trim())) {
      // console.log('🟦[blue]->plusValue: ', plusValue)
      const subCell = sheetTreStore.query.getItem(plusValue)
      // console.log('🟦[blue]->subCell: ', plusValue, subCell)
      if (subCell) {
        totalValue += evalCellValue(subCell)
      } else {
        totalValue += Number.parseInt(plusValue)
      }
    }
    return totalValue
  }
  return 0
}
sheetTreStore.command.createItem({ key: 'a1', sub: [], sup: B_ROOT, type: 'cell', valueType: 'number', value: 1 })
sheetTreStore.command.createItem({ key: 'a2', sub: [], sup: B_ROOT, type: 'cell', valueType: 'number', value: 2 })
// TODO: bl: if is formula, should auto subscribe inner cell key change
sheetTreStore.command.createItem({ key: 'b1', sub: [], sup: B_ROOT, type: 'cell', valueType: 'formula', value: 'a1 + a2' })

sheetTreStore.command.subscribeItem({ key: 'b1', subscribeKey: 'a1' })
sheetTreStore.command.subscribeItem({ key: 'b1', subscribeKey: 'a2' })
sheetTreStore.command.createItem({ key: 'b2', sub: [], sup: B_ROOT, type: 'cell', valueType: 'formula', value: 'b1 + 1' })
sheetTreStore.command.subscribeItem({ key: 'b2', subscribeKey: 'b1' })

console.log(evalCellValue(sheetTreStore._itemMap.get('a1')!))
console.log(evalCellValue(sheetTreStore._itemMap.get('a2')!))
console.log(evalCellValue(sheetTreStore._itemMap.get('b1')!))
console.log(evalCellValue(sheetTreStore._itemMap.get('b2')!))

sheetTreStore.command.updateItem({ key: 'a1', value: 99 })
console.log(evalCellValue(sheetTreStore._itemMap.get('a1')!))
console.log(evalCellValue(sheetTreStore._itemMap.get('a2')!))
console.log(evalCellValue(sheetTreStore._itemMap.get('b1')!))
console.log(evalCellValue(sheetTreStore._itemMap.get('b2')!))
// console.log(sheetTreStore._itemMap.keys())
