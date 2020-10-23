import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch("https://super.roomservice.dev/provision", {
    method: "POST",
    headers: {
      Authorization: `Bearer: ${process.env.ROOMSERVICE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: nanoid(),
      resources: req.body.resources,
    }),
  })

  res.json(await response.json())
}
