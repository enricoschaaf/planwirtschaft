import { useMap, useRoom } from "@roomservice/react"
import { usePresence } from "hooks/usePresence"
import { SyntheticEvent, useEffect, useState } from "react"

export type User = {
  name: string
  isAdmin: boolean
  count: number
  isSet: boolean
  set?: number
}

export const Game = ({ id }: { id: string }) => {
  const room = useRoom(id)
  const [game, setGame] = useMap<"game" | "result">(id, "game")
  const [name, setName] = useState<string | undefined>()
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
  }, [user, game?.set, room?.me])

  useEffect(() => {
    if (Object.values(user).some(({ isAdmin }) => isAdmin)) return
    if (Object.keys(user)[0] === room.me) {
      setUser({ ...user[room.me], isAdmin: true })
    }
  }, [user, room?.me])

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      name: { value: string }
      reset: () => void
    }

    const name = target.name.value

    setName(name)

    setUser({
      name,
      isAdmin: !Object.keys(await room.presence().getAll("user")).length,
      count: 4,
      isSet: false,
    })

    target.reset()
  }

  return (
    <>
      {!name && room && (
        <form onSubmit={onSubmit}>
          <label htmlFor="name" className="sr-only">
            Namen festlegen
          </label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="off"
            required
          />
          <input type="submit" value="Namen festlegen" />
        </form>
      )}
      {user && room && game && name && (
        <>
          <ul>
            {Object.values(user).map(({ name }) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          {user[room.me]?.isAdmin &&
            (!game.get("status") || game.get("status") === "result") && (
              <button onClick={() => setGame(game.set("status", "game"))}>
                Spiel starten
              </button>
            )}
          {game.get("status") === "game" && (
            <div>
              {[0, 1, 2, 3, 4].map((i) => {
                return (
                  <button
                    key={i}
                    disabled={
                      user[room.me].count - i < 0 || user[room.me].isSet
                    }
                    onClick={() => {
                      setUser({
                        ...user[room.me],
                        count: user[room.me].count - i,
                        isSet: true,
                        set: i,
                      })
                    }}
                  >
                    {i}
                  </button>
                )
              })}
            </div>
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
    </>
  )
}
