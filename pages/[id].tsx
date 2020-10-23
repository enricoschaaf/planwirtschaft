import { Game } from "components/Game"
import { useRouter } from "next/router"

const GamePage = () => {
  const {
    query: { id },
  } = useRouter()

  if (typeof id === "string") {
    return <Game id={id} />
  }
  return null
}

export default GamePage
