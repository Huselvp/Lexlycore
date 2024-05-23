import { useEffect, useRef } from "react"

export const useClickOutside = (
  handler: () => void,
  listenCapturing: boolean = true
) => {
  const ref = useRef(null)
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current) return
      if (!(ref.current as HTMLElement).contains(event.target as Node)) {
        console.log("close")
        handler()
      } else {
        console.log("open")
      }
    }
    document.addEventListener("click", handleClick, listenCapturing)
    return () =>
      document.removeEventListener("click", handleClick, listenCapturing)
  }, [])
  return ref
}
