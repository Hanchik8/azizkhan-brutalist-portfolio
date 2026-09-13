import { useCallback, useRef } from 'react'
import { useMotionValue } from 'framer-motion'

export function useMousePosition() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rafId = useRef<number | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (rafId.current !== null) return
      rafId.current = requestAnimationFrame(() => {
        x.set(e.clientX)
        y.set(e.clientY)
        rafId.current = null
      })
    },
    [x, y],
  )

  return { x, y, handleMouseMove }
}
