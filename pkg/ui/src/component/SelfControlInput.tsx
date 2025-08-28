import React, { useState } from 'react'
import { StyledInput } from './style'

type Props = {
  handleConfirm: (...attr: any) => void
  handleChangeCallback?: (...attr: any) => void
  initialValue: string
  autoFocus?: boolean
}

const SelfControlInput = ({
  handleConfirm,
  handleChangeCallback,
  initialValue,
  autoFocus
}: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState(initialValue)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm(value)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    handleConfirm(value)
  }
  const handleChange = (e) => {
    const value = e.target.value
    setValue(value)
    handleChangeCallback?.(value)
  }

  const className = isFocused ? 'focused' : ''
  return (
    <StyledInput
      value={value}
      className={className}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      autoFocus={autoFocus}
    />
  )
}
export { SelfControlInput }
