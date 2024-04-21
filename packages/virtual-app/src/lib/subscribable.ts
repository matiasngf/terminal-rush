import { useEffect } from "react"


export interface Subscribable<T extends () => void = () => void> {
  addCallback: (callback: T) => string
  removeCallback: (id: string) => void
  getCallbacks: () => T[]
}

export const subscribable = <T extends () => void = () => void>() => {
  const callbacks: Record<string, T> = {}

  const addCallback = (callback: T) => {
    const id = Math.random().toString()
    callbacks[id] = callback
    return id
  }

  const removeCallback = (id: string) => {
    delete callbacks[id]
  }

  const getCallbacks = () => Object.values(callbacks)

  return {
    addCallback,
    removeCallback,
    getCallbacks
  } as Subscribable<T>

}


export const useSubscribe = <T extends () => void = () => void>(subscribable: Subscribable<T>, callback: T, deps: unknown[] = []) => {
  useEffect(() => {
    const id = subscribable.addCallback(callback)
    return () => subscribable.removeCallback(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribable, ...deps])
}
