import { useState } from 'react'

const useRefresh = () => {
  const [refreshCount, setRefresh] = useState(0)
  const refresh = () => {
    setRefresh((pre) => pre + 1)
  }
  return refresh
}
export { useRefresh }
