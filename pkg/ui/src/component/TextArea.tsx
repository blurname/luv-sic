import {useRef, useState} from "react"
const MAX_LENGTH = 1000

const BTextarea = ({ className, placeholder, handleSubmit, promptInputRef, isLoading, isHidden, onIsSelected, ExtraCmpFromDesignChat, defaultValue, dashboardInputRef, selectExample, prjCid }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [value, setValue] = useState('')
  const [undoStack, setUndoStack] = useState<string[]>([''])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const handleSetValue = (saveValue) => {
    setValue(saveValue)
    return 
  }
  const saveToHistory = (saveValue: string, prevValue: string) => {
    handleSetValue(saveValue)
    addUndoResetRedo(prevValue)
  }

  const addUndoResetRedo = (value: string) => {
    setRedoStack([])
    setUndoStack([...undoStack, value])
  }

  const handleRedo = () => {
    const redoEdit = redoStack.pop()!
    if (redoEdit === undefined) return
    setUndoStack([...undoStack, value])
    handleSetValue(redoEdit)
  }

  const handleUndo = () => {
    const undoEdit = undoStack.pop()!
    if (undoEdit === undefined) return
    setRedoStack([...redoStack, value])
    handleSetValue(undoEdit)
  }

  const prevValueRef = useRef(null)


  const isInComposition = useRef(false)

  const handleKeydown = (e) => {
    const textarea = textareaRef.current!
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      saveToHistory(textarea.value.substring(0, start) +
        '\n' +
        textarea.value.substring(end), value)
      setTimeout(() => {
        textarea.setSelectionRange(start+1, start + 1)
        scrollToCaret()
      }, 16)
      return
    }
    if (e.key === 'Enter') {
      if (isInComposition.current) return
      e.preventDefault()
      handleConfirm()
      return
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
      e.preventDefault()
      handleRedo()
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      handleUndo()
    }
  }

  // 自动滚动到光标位置的辅助函数
  const scrollToCaret = () => {
    const textarea = textareaRef.current!
    const div = document.createElement('div');
    const style = div.style;
    const computed = getComputedStyle(textarea);
    
    // 复制 textarea 的样式到临时 div
    style.whiteSpace = 'pre-wrap';
    style.wordWrap = 'break-word';
    style.position = 'absolute';
    style.top = textarea.offsetTop + 'px';
    style.left = textarea.offsetLeft + 'px';
    style.visibility = 'hidden';
    style.padding = computed.padding;
    style.font = computed.font;
    style.width = computed.width;
    style.lineHeight = computed.lineHeight;
    
    // 获取 textarea 的内容，直到光标位置
    const textBeforeCaret = textarea.value.substring(0, textarea.selectionStart);
    
    // 用换行符替换为<br>，这样在 div 中会有相同的布局
    div.innerHTML = textBeforeCaret.replace(/\n/g, '<br>');
    
    // 添加一个看不见的标记来表示光标的位置
    const span = document.createElement('span');
    span.textContent = '.';
    span.style.visibility = 'hidden';
    div.appendChild(span);
    
    // 将临时 div 添加到文档中
    document.body.appendChild(div);
    
    // 获取标记元素的位置
    const rect = span.getBoundingClientRect();
    const {top} = rect 
    // 获取 textarea 的视口信息
    const textareaRect = textarea.getBoundingClientRect();
    
    // 计算需要滚动的距离
    // 计算需要滚动的距离

    if(!((top > textarea.scrollTop) && (top < textarea.scrollTop + textareaRect.height))){
      textarea.scrollTop  = top
    }
    div.remove()
  };

  const handleChange = (e) => {
    const input = e.target.value as string
    if (input.length > MAX_LENGTH) {
      const nextValue = input.substring(0, MAX_LENGTH)
      // setValue(nextValue)
      handleSetValue(nextValue)
      if (!isInComposition.current) {
        addUndoResetRedo(value)
      }
    } else {
      // setValue(input)
      handleSetValue(input)
      if (!isInComposition.current) {
        addUndoResetRedo(value)
      }
    }
  }


  const handleConfirm = async () => {

    handleSetValue('')
    try {
    } catch(e){
    }
  }

  return <div
    style={{
      display: isHidden ? 'none' : 'flex'
    }}
    className={cx(className, 'prompt-input-container')}>
    <textarea
      id={'prompt-textarea'}
      ref={textareaRef}
      onKeyDown={handleKeydown}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      onCompositionStart={
        (e) => {
          isInComposition.current = true
          e.preventDefault()
          prevValueRef.current = value
        }
      }

      onCompositionEnd={
        (e) => {
          isInComposition.current = false
          e.preventDefault()
          const input = e.target.value
          saveToHistory(input, prevValueRef.current)
        }
      }

      onPaste={(e) => {
        const text = e.clipboardData?.getData('text/plain')
        e.preventDefault()
        const { pasteType } = // getPasteType(e)

        if (pasteType === 'FILES') {
          const files = Array.from(e.clipboardData.items)
            .map(i => i.getAsFile())
            .filter(file => file)
          return
        }
        if (text) {
          const selectionStart = textareaRef.current!.selectionStart
          const selectionEnd = textareaRef.current!.selectionEnd
          let nextValue = value.substring(0, selectionStart) + text + value.substring(selectionEnd)
          // let nextValue = value + text
          if (nextValue.length > MAX_LENGTH) {
            nextValue = nextValue.substring(0, MAX_LENGTH)
          }
          const newStart = selectionStart + text.length
          saveToHistory(nextValue, value)
          setTimeout(() => {
            textareaRef.current!.setSelectionRange(newStart, newStart)
          }, 16)
        }
      }}

      onFocus={() => onIsSelected && onIsSelected(true)}
      onBlur={() => onIsSelected && onIsSelected(false)}
    />
  <div>
}

