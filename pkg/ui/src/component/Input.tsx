import React, { useState } from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN } from '../colorToken'
type Props = {
    handleConfirm?: (...attr:any)=>void
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input = ({ handleConfirm, ...attr }:Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm && handleConfirm(value)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    handleConfirm && handleConfirm(value)
  }
  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const className = isFocused ? 'focused' : ''
  return <StyledInput
  className={className}
  onFocus={ handleFocus}
  onBlur={handleBlur}
  onChange={handleChange}
  onKeyUp={handleKeyUp}
  {...attr}
  />
}

// {...attr}
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
