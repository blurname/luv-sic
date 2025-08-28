import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Input } from './Input'
import { SelfControlInput } from './SelfControlInput'

const _prevHighlightTextNodeBackgroundMap = new Map<Node, string>()
let currentJumpNode: Node
const GlobalSearch = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      } else if (e.key === 'Escape') {
        clearHightTextNodeBatch()
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleConfirm = () => {
    // scrollToTextNode(currentJumpNode)
  }

  const handleChangeCallback = (value: string) => {
    clearHightTextNodeBatch()
    if (value.trim() === '') {
      return
    }
    const nodeList = getAllTextNodeList()
    const resultNodeList: Node[] = []
    for (const textNode of nodeList) {
      if (textNode.textContent?.toLowerCase().indexOf(value) !== -1) {
        resultNodeList.push(textNode)
      }
    }
    hgithLightTextNodeBatch(resultNodeList)
    console.log(resultNodeList)
  }
  if (!open) return null

  return (
    <StyledGlobalSearch>
      <SelfControlInput
        initialValue={''}
        handleConfirm={handleConfirm}
        handleChangeCallback={handleChangeCallback}
        autoFocus={true}
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

const clearHightTextNodeBatch = () => {
  for (const [
    node,
    originalBackground
  ] of _prevHighlightTextNodeBackgroundMap) {
    node.parentElement!.style.background = originalBackground
  }
  _prevHighlightTextNodeBackgroundMap.clear()
}

const hgithLightTextNodeBatch = (nodeList: Node[]) => {
  for (const node of nodeList) {
    _prevHighlightTextNodeBackgroundMap.set(
      node,
      node.parentElement!.style.background
    )
    node.parentElement!.style.background = 'yellow'
  }
}

const scrollToTextNode = (node: Node) => {
  document.body.scrollTop = node.parentElement?.getBoundingClientRect().top || 0
}

const StyledGlobalSearch = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
`
export { GlobalSearch }
