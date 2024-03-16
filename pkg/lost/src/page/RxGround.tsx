import React, { useEffect, useState } from 'react'
import { Elevator } from './rxbox/Elevator'

export function RxGround () {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <BoxContainer title={'elevator'}>
        <Elevator/>
      </BoxContainer>
      <BoxContainer title={'elevator'}>
        <Elevator/>
      </BoxContainer>
    </div>
  )
}

const BoxContainer = ({ title, children }) => {
  return (
    <div style={{ background: '#0022', width: '100%', outline: '1px solid #00f2', marginBottom: 10 }}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
