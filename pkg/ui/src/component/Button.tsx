import React from 'react'
import styled from 'styled-components'
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
  background: ${props => props.theme.button.bg};
  outline: 1px solid ${props => props.theme.border};
  &:hover {
    background: ${props => props.theme.button.hover};
  }
  &:active {
    background: ${props => props.theme.button.active};
  }
`
export {
  Button
}
