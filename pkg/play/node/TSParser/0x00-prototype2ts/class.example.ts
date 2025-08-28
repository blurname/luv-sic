import PropTypes from 'prop-types'
import { PureComponent, ReactNode } from 'react'

export default class Canvas0 extends PureComponent {
  static propTypes = {
    cursorClass: PropTypes.string,
    keyState: PropTypes.object,
    viewportRect: PropTypes.object,
    isCreatingLine: PropTypes.bool,
    isCreatingStamp: PropTypes.bool,
    bgcolor: PropTypes.string,
    dispatch: PropTypes.func
  }
}
type a = {
  cursorClass: string
}
export default class Canvas1 extends PureComponent<a> {}
