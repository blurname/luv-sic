import styled from 'styled-components'
const StyledEditor = styled.textarea`
  // outline: none;
`
const StyledBufferList = styled.div`
  display: flex;
  cursor: default;
  user-select: none;
  font-size: 12px;

  .add-btn {
    &:hover {
      background:${props => props.isactive ? 'rgba(135, 63, 234, 0.4)' : 'rgba(135, 63, 234, 0.1)'}; ;
    }
`
type StyledBufferProps = {
    isactive:boolean
}
const StyledBuffer = styled.div<StyledBufferProps>`
  display: flex;
  span {
  background: ${props => props.isactive ? 'rgba(135, 63, 234, 0.4)' : 'whtie'};
  &:hover {
    background:${props => props.isactive ? 'rgba(135, 63, 234, 0.4)' : 'rgba(135, 63, 234, 0.1)'}; 
  }
    }
  .del-btn {
      &:hover {
        background: red;
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
