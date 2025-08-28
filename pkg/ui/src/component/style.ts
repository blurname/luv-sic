import styled from 'styled-components'
import { COLOR_TOKEN_PROTO } from '../colorToken'

const StyledInput = styled.input`
  border: none;
  outline: none;
  outline: 1px solid ${COLOR_TOKEN_PROTO.gray1};
  &.focused {
    outline: 1px solid ${COLOR_TOKEN_PROTO.blue1};
  }
  border-radius: 4px;
`
export { StyledInput }
