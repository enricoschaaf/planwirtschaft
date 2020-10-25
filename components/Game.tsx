import { InnerMapClient } from "@roomservice/browser/dist/MapClient"
import { Modal } from "components/Modal"
import { NameForm } from "components/NameForm"
import { Title } from "components/Title"
import { m as motion } from "framer-motion"
import { useMap, usePresence, useRoom } from "hooks"
import { useContext, useEffect, useRef, useState } from "react"
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
  user: { [key: string]: User }
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
  const constraintsRef = useRef()
  const [bottleCaps, setBottleCaps] = useState([0, 1, 2, 3])
  const dropRef = useRef<HTMLDivElement>()
  const bottleCapRef0 = useRef<HTMLSpanElement>()
  const bottleCapRef1 = useRef<HTMLSpanElement>()
  const bottleCapRef2 = useRef<HTMLSpanElement>()
  const bottleCapRef3 = useRef<HTMLSpanElement>()

  useEffect(() => {
    if (
      Object.entries(userMap.toObject())
        .filter(([key]) => Object.values(user).find(({ name }) => key === name))
        .every(([, isSet]) => isSet)
    ) {
      setGame(game?.set("status", "result"))
    }
  }, [user, userMap])

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
      <div ref={constraintsRef}>
        <div
          ref={dropRef}
          className="rounded-3xl border-indigo-600 border-2 w-full pb-full"
        />
        {user[room.me].count > 0 && (
          <span className="space-x-2">
            {bottleCaps.map((bottleCaps) => (
              <motion.img
                data-id={bottleCaps}
                key={bottleCaps}
                src="/kronkorken.png"
                alt="Kronkorken"
                ref={eval(`bottleCapRef${bottleCaps}`)}
                className="inline w-20 h-20"
                dragConstraints={constraintsRef}
                dragMomentum={false}
                drag
              />
            ))}
          </span>
        )}
      </div>
      <p>Du hast noch {user[room.me].count} Kronkorken übrig.</p>
      {game.get("status") && (
        <div>
          <span className="inline-flex rounded-md shadow-sm">
            <button
              className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
              onClick={() => {
                if (!userMap.get(name)) {
                  const {
                    top: dropTop,
                    right: dropRight,
                    bottom: dropBottom,
                    left: dropLeft,
                  } = dropRef.current.getBoundingClientRect()
                  let set = 0

                  const bottleCaps = [
                    bottleCapRef0.current,
                    bottleCapRef1.current,
                    bottleCapRef2.current,
                    bottleCapRef3.current,
                  ]

                  bottleCaps
                    .filter((bottleCap) => bottleCap)
                    .forEach((bottleCap) => {
                      const {
                        top: bottleCapTop,
                        right: bottleCapRight,
                        bottom: bottleCapBottom,
                        left: bottleCapLeft,
                      } = bottleCap.getBoundingClientRect()

                      if (
                        bottleCapTop > dropTop &&
                        bottleCapBottom < dropBottom &&
                        bottleCapLeft > dropLeft &&
                        bottleCapRight < dropRight
                      ) {
                        set++
                        setBottleCaps((previousState) =>
                          previousState.filter(
                            (currentBottleCap) =>
                              currentBottleCap !==
                              parseInt(bottleCap.dataset.id),
                          ),
                        )
                      }
                    })
                  setUser({
                    ...user[room.me],
                    count: user[room.me].count - set,
                    set,
                  })
                  setUserMap(userMap.set(name, true))
                }
              }}
            >
              Bereit
            </button>
          </span>
        </div>
      )}
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
                {game.get("status") === "result"
                  ? "Nächste Runde"
                  : "Spiel starten"}
              </button>
            </span>
          </div>
        )}
    </div>
  )
}
