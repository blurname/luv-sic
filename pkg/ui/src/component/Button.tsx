import React from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN, COLOR_TOKEN_PROTO } from '../colorToken'

type Props = {
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  type: 'primary' | 'second'
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
const Button = ({ children, disabled, loading, type, ...attr }: Props) => {
  const className = `${type} ${disabled ? 'disabled' : 'active'}`
  let content = children
  let onClick = attr.onClick
  if (loading) {
    content = 'loading'
    onClick = undefined
    // className += 'loading'
  }

  return (
    <StyledButton className={className} {...attr} onClick={onClick}>
      {content}
    </StyledButton>
  )
}
const StyledButton = styled.button`
  border: none;
  background: ${COLOR_TOKEN.button.bg};
  width: 80px;
  height: 32px;
  border-radius: 6px;
  font-size: 14px;
  &.primary {
    color: ${COLOR_TOKEN_PROTO.primaryBtn.text};
    background: ${COLOR_TOKEN_PROTO.primaryBtn.normal};
    &:hover {
      background: ${COLOR_TOKEN_PROTO.primaryBtn.hover};
    }
    &:active {
      background: ${COLOR_TOKEN_PROTO.primaryBtn.active};
    }

    &.disabled {
      cursor: none;
      pointer-events: none;
      background: ${COLOR_TOKEN_PROTO.primaryBtn.disable};
    }
  }
  &.second {
    color: ${COLOR_TOKEN_PROTO.secondBtn.text};
    background: ${COLOR_TOKEN_PROTO.secondBtn.normal};
    border: 1px solid ${COLOR_TOKEN_PROTO.gray1};
    &:hover {
      background: ${COLOR_TOKEN_PROTO.secondBtn.hover};
    }
    &:active {
      background: ${COLOR_TOKEN_PROTO.secondBtn.active};
    }

    &.disabled {
      cursor: none;
      pointer-events: none;
      background: ${COLOR_TOKEN_PROTO.secondBtn.disable};
      color: ${COLOR_TOKEN_PROTO.secondBtn.disabledText};
    }
  }
`
export { Button }
