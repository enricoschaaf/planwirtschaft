import { useEffect, useState } from "react"
import { NameContext } from "utils/NameContext"
import { RoomServiceProvider } from "utils/RoomServiceContext"
import "../styles/index.css"

export default function MyApp({ Component, pageProps }) {
  const [name, setName] = useState<string | undefined>()

  useEffect(() => {
    const persistentName = localStorage.getItem("name")
    if (persistentName) setName(persistentName)
  }, [])

  useEffect(() => {
    if (name) {
      localStorage.setItem("name", name)
    }
  }, [name])

  return (
    <RoomServiceProvider
      clientParameters={{
        auth: "/api/roomservice",
      }}
    >
      <NameContext.Provider value={[name, setName]}>
        <Component {...pageProps} />
      </NameContext.Provider>
    </RoomServiceProvider>
  )
}
