import { CreateGameButton } from "components/CreateGameButton"
import { useRoom } from "hooks"

export const IndexComponent = ({ id }: { id: string }) => {
  useRoom(id)
  return <CreateGameButton id={id} />
}
