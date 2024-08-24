import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Input } from './Input'
import { SelfControlInput } from './SelfControlInput'
const prevHighlightTextNodeBackgroundMap = new Map<Node, string>()
const GlobalSearch = () => {
  const [open, setOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])
  const handleConfirm = () => {

  }
  const handleChangeCallback = (value: string) => {
    if (value.trim() === '') return
    const nodeList = getAllTextNodeList()
    const resultNodeList: Node[] = []
    for (const textNode of nodeList) {
      if (textNode.textContent?.toLowerCase().indexOf(value) !== -1) {
        resultNodeList.push(textNode)
      }
    }
    if (resultNodeList.length) {
      hgithLightTextNodeBatch(resultNodeList)
    }
    console.log(resultNodeList)
  }
  if (!open) return null

  return (
    <StyledGlobalSearch>
    <SelfControlInput
    initialValue={''}
    handleConfirm={handleConfirm}
    handleChangeCallback={handleChangeCallback}
    />
    </StyledGlobalSearch>
  )
}
const getAllTextNodeList = () => {
  const textNodes: Node[] = []
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  )
  let currentNode: Node | null
  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode)
  }
  return textNodes
}

const hgithLightTextNodeBatch = (nodeList: Node[]) => {
  for (const [node, originalBackground] of prevHighlightTextNodeBackgroundMap) {
    node.parentElement!.style.background = originalBackground
  }
  prevHighlightTextNodeBackgroundMap.clear()
  for (const node of nodeList) {
    prevHighlightTextNodeBackgroundMap.set(node, node.parentElement!.style.background)
    // if (node.parentElement) {
    node.parentElement!.style.background = 'yellow'
    // }
  }
}

const StyledGlobalSearch = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
`
export {
  GlobalSearch
}
