import { PresenceClient } from "@roomservice/browser"
import { useRoom } from "@roomservice/react"
import { useCallback, useEffect, useRef, useState } from "react"

export function usePresence<T extends any>(
  roomName: string,
  key: string,
  exp: number,
): [{ [key: string]: T }, (value: T) => any] {
  const presence = useRef<PresenceClient>()
  const [val, setVal] = useState<{ [key: string]: T }>({})
  const room = useRoom(roomName)

  useEffect(() => {
    if (!room) return

    const p = room!.presence()
    presence.current = p

    p.getAll(key).then((val: { [key: string]: T }) => setVal(val))

    room!.subscribe<T>(p, key, (val) => {
      setVal((previousVal) => ({
        [presence.current.me]: previousVal[room.me],
        ...val,
      }))
    })
  }, [room, key])

  //TODO: batch calls to this function before presence is ready
  const set = useCallback((value: T) => {
    if (!presence.current) return
    presence.current?.set(key, value, exp)
    setVal((previousVal) => ({ ...previousVal, [presence.current.me]: value }))
  }, [])

  return [val, set]
}
