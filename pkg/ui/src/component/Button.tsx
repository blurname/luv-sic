import React from 'react'
import styled from 'styled-components'
import { COLOR_TOKEN } from '../colorToken'

type Props = {
  children: React.ReactNode
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
const Button = ({ children, ...attr }:Props) => {
  return <StyledButton {...attr}>
  {children}
  </StyledButton>
}
const StyledButton = styled.button`
  border: none;
  background: ${COLOR_TOKEN.button.bg};
  outline: 1px solid ${COLOR_TOKEN.border};
  &:hover {
    background: ${COLOR_TOKEN.button.hover};
  }
  &:active {
    background: ${COLOR_TOKEN.button.active};
  }
`
export {
  Button
}
