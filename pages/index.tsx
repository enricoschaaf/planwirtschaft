import { useRoom } from "@roomservice/react"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useEffect, useState } from "react"

const Index = () => {
  const [id, setId] = useState<string | undefined>()

  useEffect(() => {
    setId(nanoid(5))
  }, [])

  if (id) {
    return <IndexCompoent id={id} />
  }
  return null
}

export default Index

const IndexCompoent = ({ id }: { id: string }) => {
  useRoom(id)
  return (
    <Link href={`/${id}`}>
      <a>Spiel erstellen</a>
    </Link>
  )
}
