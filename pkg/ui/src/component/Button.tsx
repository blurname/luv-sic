import React from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN } from '../colorToken'

type Props = {
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
const Button = ({ children, disabled, loading, ...attr }:Props) => {
  const className = disabled ? 'disabled' : 'active'
  let content = children
  let onClick = attr.onClick
  if (loading) {
    content = 'loading'
    onClick = undefined
    // className += 'loading'
  }

  return <StyledButton className={className} {...attr} onClick={onClick}>
  {content}
  </StyledButton>
}
const StyledButton = styled.button`
  border: none;
  background: ${COLOR_TOKEN.button.bg};
  outline: 1px solid ${COLOR_TOKEN.border};
  &.active {
    &:hover {
      background: ${COLOR_TOKEN.button.hover};
    }
    &:active {
      background: ${COLOR_TOKEN.button.active};
    }
    &.loading {

    }
  }
  &.disabled {
    cursor: none;
    pointer-events: none;
    color:#ccc;
  }
`
export {
  Button
}
