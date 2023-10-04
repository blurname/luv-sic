import { Remesh } from 'remesh'
type Selection = string[]

const ElementDomain = Remesh.domain({
  name: 'SelectionDomain',
  impl: (domain) => {
    const SelectionState = domain.state<Selection>({
      name: 'SelectionState',
      default: []
    })

    const SelectionQuery = domain.query({
      name: 'SelectionQuery',
      impl ({ get }) {
        const selection = get(SelectionState())
        return selection
      }
    })

    const SelectionUpdateCommand = domain.command({
      name: 'SelectionUpdateCommand',
      impl (_, newSelection:Selection) {
        return [SelectionState().new(newSelection)]
      }
    })

    return {
      query: {
        SelectionQuery
      },
      command: {
        SelectionUpdateCommand
      }
    }
  }
})
export type {
  // Buffer
}
export {
  ElementDomain
}
