import PushNotifications from "@pusher/push-notifications-server"
import { NextApiRequest, NextApiResponse } from "next"

const beamsClient = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.NEXT_PUBLIC_PUSHER_BEAMS_SECRET_KEY,
})

export default async ({ body }: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = body

    if (!id) res.status(400).end()

    await beamsClient.publishToInterests(["planwirtschaft"], {
      web: {
        notification: {
          title: "Planwirtschaft",
          body: "Neue Runde Planwirtschaft gestartet.",
          deep_link: `https://planwirtschaft.enricoschaaf.com/${id}`,
        },
      },
    })
    res.end()
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}
