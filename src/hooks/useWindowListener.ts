import { useEffect, useState } from "react"

export const useWindowListener = (handler?: () => void) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const resizeHandler = () => {
    setWindowWidth(window.innerWidth)
    handler?.()
  }
  useEffect(() => {
    window.addEventListener("resize", resizeHandler)
    return () => window.removeEventListener("resize", resizeHandler)
  }, [])
  return { windowWidth }
}
