import { useState, useEffect } from "react"

let globalOpen = false
const listeners = new Set<(v: boolean) => void>()

export function useSidebar() {
  const [open, setOpen] = useState(globalOpen)
  
  useEffect(() => {
    listeners.add(setOpen)
    return () => { listeners.delete(setOpen) }
  }, [])

  return {
    open,
    show: () => { globalOpen = true; listeners.forEach(l => l(true)) },
    hide: () => { globalOpen = false; listeners.forEach(l => l(false)) }
  }
}
