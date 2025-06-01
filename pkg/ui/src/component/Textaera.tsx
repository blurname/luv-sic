import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN_PROTO } from '../colorToken'
type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Textarea = forwardRef((props:Props) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const className = isFocused ? 'focused' : ''
  return <StyledTextarea
  className={className}
  onFocus={ handleFocus}
  onBlur={handleBlur}
  {...props}
  />
})
const StyledTextarea = styled.input`
  border: none;
  outline: none;
  outline: 1px solid ${COLOR_TOKEN_PROTO.gray1};
  &.focused {
    outline: 1px solid ${COLOR_TOKEN_PROTO.blue1};
  }
  border-radius: 4px;
`


export {
  Textarea
}
