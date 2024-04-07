import React, { useState } from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN } from '../colorToken'
type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
const Input = ({ ...attr }:Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const handleFocus = () => {
    setIsFocused(true)
  }
  const handleBlur = () => {
    setIsFocused(false)
  }
  const className = isFocused ? 'focused' : ''
  return <StyledInput className={className} onFocus={() => handleFocus()} onBlur={() => handleBlur()} {...attr}/>
}
const StyledInput = styled.input`
  border: none;
  outline: none;
  outline: 1px solid ${COLOR_TOKEN.border};
  &.focused {
    outline: 1px solid rgba(135, 63, 234, 0.9);
  }
`
export {
  Input
}
