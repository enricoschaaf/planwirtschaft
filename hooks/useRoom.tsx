import { RoomClient } from "@roomservice/browser"
import { useContext, useEffect, useState } from "react"
import { context } from "utils/RoomServiceContext"

export function useRoom(roomName: string): RoomClient | undefined {
  const ctx = useContext(context)
  if (!ctx.addRoom) {
    throw new Error(
      "A hook is being used outside the RoomServiceProvider. Learn more: https://err.sh/getroomservice/react/no-provider",
    )
  }
  const [room, setRoom] = useState<RoomClient>()

  useEffect(() => {
    let isMounted = true

    ctx!.addRoom!(roomName)
      .then((room) => isMounted && setRoom(room))
      .catch(console.error)

    return () => (isMounted = false)
  }, [roomName])

  return room
}
