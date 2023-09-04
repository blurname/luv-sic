// @ts-nocheck
import styled from 'styled-components'
const StyledEditor = styled.textarea`
  flex: 1;
  border: none;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  background: #f5f5f5;
  border: 2px solid rgba(0, 132, 255, 0.133);
  resize: none;
`
const StyledBufferList = styled.div`
  display: flex;
  cursor: default;
  user-select: none;
  font-size: 12px;
  overflow-x: scroll;

  .add-btn {
    &:hover {
      background:${props => props.$isactive ? 'rgba(135, 63, 234, 0.3)' : 'rgba(135, 63, 234, 0.1)'};
    }
`
type StyledBufferProps = {
    $isactive:boolean
}
const StyledBuffer = styled.div<StyledBufferProps>`
  display: flex;
  span {
    background: ${props => props.$isactive ? 'rgba(135, 63, 234, 0.3)' : 'whtie'};
    &:hover {
      background:${props => props.$isactive ? 'rgba(135, 63, 234, 0.3)' : 'rgba(135, 63, 234, 0.1)'}; 
    }
  }
  .del-btn {
    &:hover {
      background: #f009;
    }
  }
  .divider {
    width: 2px;
    background: rgba(15, 6, 2, 0.4);
    margin-right: 10px;
  }
`
export {
  StyledEditor,
  StyledBufferList, StyledBuffer
}
