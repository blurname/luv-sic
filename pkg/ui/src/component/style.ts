import styled from 'styled-components'
import { COLOR_TOKEN } from '../colorToken'
const StyledInput = styled.input`
  border: none;
  outline: none;
  outline: 1px solid ${COLOR_TOKEN.border};
  &.focused {
    outline: 1px solid rgba(135, 63, 234, 0.9);
  }
`
export {
  StyledInput
}
