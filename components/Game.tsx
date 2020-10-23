import { InnerMapClient } from "@roomservice/browser/dist/MapClient"
import { Modal } from "components/Modal"
import { NameForm } from "components/NameForm"
import { Title } from "components/Title"
import { useMap, usePresence, useRoom } from "hooks"
import { useContext, useEffect } from "react"
import { NameContext } from "utils/NameContext"

export type User = {
  name: string
  isAdmin: boolean
  count: number
  set: number
}

export const Game = ({ id }: { id: string }) => {
  const room = useRoom(id)
  const [game, setGame] = useMap<"lobby" | "game" | "result">(id, "game")
  const [userMap, setUserMap] = useMap<boolean>(id, "user")
  const [name] = useContext(NameContext)
  const [user, setUser] = usePresence<User>(id, "user", 1000 * 60 * 60)

  useEffect(() => {
    if (user[room?.me] || !userMap) return
    setUser({
      name,
      isAdmin: !Object.keys(user).length,
      count: 4,
      set: 0,
    })
    setUserMap(userMap.set(name, false))
  }, [user, room, name])

  return (
    <>
      <Title>Raum</Title>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid place-items-center">
        <Modal modal={name ? "hide" : "show"}>
          <NameForm />
        </Modal>
        {room && game && name && user[room.me] && (
          <GameComponent
            name={name}
            userMap={userMap}
            setUserMap={setUserMap}
            room={room}
            game={game}
            setGame={setGame}
            user={user}
            setUser={setUser}
          />
        )}
      </div>
    </>
  )
}

const GameComponent = ({
  name,
  room,
  game,
  setGame,
  user,
  setUser,
  userMap,
  setUserMap,
}: {
  name
  room
  game
  setGame
  user
  setUser
  userMap: Pick<
    InnerMapClient<boolean>,
    "keys" | "get" | "set" | "toObject" | "delete"
  >
  setUserMap: (
    map: Pick<
      InnerMapClient<boolean>,
      "keys" | "get" | "set" | "toObject" | "delete"
    >,
  ) => any
}) => {
  useEffect(() => {
    if (Object.values(userMap.toObject()).every((isSet) => isSet)) {
      setGame(game?.set("status", "result"))
    }
  }, [userMap])

  useEffect(() => {
    if (Object.values(user).some(({ isAdmin }) => isAdmin)) return
    if (Object.keys(user)[0] === room.me) {
      setUser({ ...user[room.me], isAdmin: true })
    }
  }, [user, room])

  return (
    <div className="grid gap-4">
      <ul>
        {Object.values(user).map(({ name: userName, set }) => (
          <li key={userName}>
            {name === userName
              ? `${
                  game.get("status") === "game"
                    ? `${
                        userMap.get(userName)
                          ? " Du hast gesetzt."
                          : " Du muss noch setzen."
                      }`
                    : game.get("status") === "result"
                    ? ` Du hast ${set} gesetzt.`
                    : "Du bist dem Spiel beigetreten."
                }`
              : `${userName}${
                  game.get("status") === "game"
                    ? `${
                        userMap.get(userName)
                          ? " hat gesetzt."
                          : " muss noch setzen."
                      }`
                    : game.get("status") === "result"
                    ? ` hat ${set} gesetzt.`
                    : " ist dem Spiel beigetreten."
                }`}
          </li>
        ))}
      </ul>
      {game.get("status") === "game" && (
        <span className="space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="inline-flex rounded-md shadow-sm">
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 disabled:opacity-50"
                disabled={user[room.me].count - i < 0 || userMap[room.me]}
                onClick={() => {
                  setUser({
                    ...user[room.me],
                    count: user[room.me].count - i,
                    set: i,
                  })
                  setUserMap(userMap.set(name, true))
                }}
              >
                {i}
              </button>
            </span>
          ))}
        </span>
      )}
      <p>Du hast noch {user[room.me].count} Kronkorken übrig.</p>
      {user[room.me].isAdmin &&
        (!game.get("status") || game.get("status") === "result") && (
          <div>
            <span className="inline-flex rounded-md shadow-sm">
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                onClick={() => {
                  setGame(game.set("status", "game"))
                  userMap.keys.forEach((key) =>
                    setUserMap(userMap.set(key, false)),
                  )
                }}
              >
                Spiel starten
              </button>
            </span>
          </div>
        )}
    </div>
  )
}
