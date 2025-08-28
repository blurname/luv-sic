import React, { forwardRef, useState } from 'react'
import { StyledInput } from './style'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const Input = forwardRef((props: Props) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const className = isFocused ? 'focused' : ''
  return (
    <StyledInput
      className={className}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  )
})

export { Input }
