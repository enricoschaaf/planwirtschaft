import { Client } from "@pusher/push-notifications-web"
import { useEffect } from "react"

export const Notifications = () => {
  useEffect(() => {
    const beamsClient = new Client({
      instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID,
    })
    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest("planwirtschaft"))
      .catch(console.error)
  }, [])
  return null
}
