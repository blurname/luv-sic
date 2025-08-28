type ClipboardItem = {
  mimeType: 'text/plain'
  data: string
}
const performNativeCopy = (items: ClipboardItem[]): boolean => {
  let success = false
  const tempElem = document.createElement('textarea')
  tempElem.value = 'temp'
  document.body.appendChild(tempElem)
  tempElem.select()
  tempElem.setSelectionRange(0, tempElem.value.length)

  const listener = (e: ClipboardEvent) => {
    const clipboardData = e.clipboardData
    if (clipboardData) {
      items.forEach((item) => clipboardData.setData(item.mimeType, item.data))
    }

    e.preventDefault()
    e.stopPropagation()
    tempElem.removeEventListener('copy', listener)
  }

  tempElem.addEventListener('copy', listener)
  try {
    success = document.execCommand('copy')
  } finally {
    tempElem.removeEventListener('copy', listener)
    document.body.removeChild(tempElem)
  }
  return success
}
export { performNativeCopy }
