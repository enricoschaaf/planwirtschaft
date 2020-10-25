import { Game } from "components/Game"
import { DragFeature, MotionConfig } from "framer-motion"
import { useRouter } from "next/router"

const GamePage = () => {
  const {
    query: { id },
  } = useRouter()

  return (
    <>
      <MotionConfig features={[DragFeature]}>
        {typeof id === "string" && <Game id={id} />}
      </MotionConfig>
    </>
  )
}

export default GamePage
