import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

type AnimCallback = (gsap: any, el: HTMLElement) => void

export function useGsap(callback: AnimCallback, deps: any[] = []) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!ref.current) return
    callback(gsap, ref.current!)
  }, { dependencies: deps, scope: ref })

  return ref
}

export async function gsapAnim(callback: (gsap: any) => void) {
  const { gsap } = await import("gsap")
  callback(gsap)
}
