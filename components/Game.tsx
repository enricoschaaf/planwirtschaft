import { NameForm } from "components/NameForm"
import { Title } from "components/Title"
import { useMap, usePresence, useRoom } from "hooks"
import { useContext, useEffect, useState } from "react"
import { NameContext } from "utils/NameContext"

export type User = {
  name: string
  isAdmin: boolean
  count: number
  isSet: boolean
  set?: number
}

export const Game = ({ id }: { id: string }) => {
  const room = useRoom(id)
  const [game, setGame] = useMap<"lobby" | "game" | "result">(id, "game")
  const [rerender, setRerender] = useState<number | undefined>()
  const [name] = useContext(NameContext)
  const [user, setUser] = usePresence<{
    name: string
    isAdmin: boolean
    count: number
    isSet: boolean
    set?: number
  }>(id, "user", 1000 * 60 * 60)

  useEffect(() => {
    if (!user || !game || !room) return
    if (!user[room?.me]) return
    if (Object.values(user).every(({ isSet }) => isSet)) {
      setGame(game?.set("status", "result"))
      setUser({
        ...user[room.me],
        isSet: false,
      })
    }
  }, [user, game?.set, room?.me, rerender])

  useEffect(() => {
    if (Object.values(user).some(({ isAdmin }) => isAdmin) || !room) return
    if (Object.keys(user)[0] === room.me) {
      setUser({ ...user[room.me], isAdmin: true })
    }
  }, [user, room?.me])

  return (
    <>
      <Title>Raum</Title>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid place-items-center">
        {!name && room && <NameForm />}
        <button
          onClick={() =>
            setUser({
              name,
              isAdmin: !Object.keys(user).length,
              count: 4,
              isSet: false,
            })
          }
        >
          Beitreten
        </button>
        {user && room && game && name && (
          <>
            <div className="prose">
              <h3>Lobby</h3>
            </div>
            <ul className="flex gap-2">
              {Object.values(user).map(({ name }) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            {user[room.me]?.isAdmin &&
              (!game.get("status") || game.get("status") === "result") && (
                <span className="inline-flex rounded-md shadow-sm">
                  <button
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                    onClick={() => setGame(game.set("status", "game"))}
                  >
                    Spiel starten
                  </button>
                </span>
              )}
            {game.get("status") === "game" && (
              <span className="space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <button
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 disabled:opacity-50"
                    key={i}
                    disabled={
                      user[room.me]?.count - i < 0 || user[room.me]?.isSet
                    }
                    onClick={() => {
                      setUser({
                        ...user[room.me],
                        count: user[room.me].count - i,
                        isSet: true,
                        set: i,
                      })
                      setRerender(Math.random())
                    }}
                  >
                    {i}
                  </button>
                ))}
              </span>
            )}
            {user[room.me] && <p>Kronkorken übrig: {user[room.me].count}</p>}
            {game.get("status") === "result" && (
              <ul>
                {Object.values(user).map(({ name, set }) => (
                  <li key={name}>
                    {name}: {set ?? 0}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  )
}
