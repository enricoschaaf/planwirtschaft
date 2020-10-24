import PushNotifications from "@pusher/push-notifications-server"
import { NextApiRequest, NextApiResponse } from "next"

const beamsClient = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.NEXT_PUBLIC_PUSHER_BEAMS_SECRET_KEY,
})

export default async ({ body }: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, name } = body

    if (!id || !name) res.status(400).end()

    await beamsClient.publishToInterests(["planwirtschaft"], {
      web: {
        notification: {
          title: "Planwirtschaft",
          body: `${name} hat eine neue Runde Planwirtschaft gestartet.`,
          deep_link: `https://planwirtschaft.enricoschaaf.com/${id}`,
          //@ts-expect-error
          hide_notification_if_site_has_focus: true,
        },
      },
    })
    res.end()
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}
