import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { NameContext } from "utils/NameContext"
import { RoomServiceProvider } from "utils/RoomServiceContext"
import "../styles/index.css"

export default function MyApp({ Component, pageProps }) {
  const [name, setName] = useState<string | undefined>()
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js")
      setServiceWorkerRegistered(true)
    }
    const persistentName = localStorage.getItem("name")
    if (persistentName) setName(persistentName)
  }, [])

  useEffect(() => {
    if (name) {
      localStorage.setItem("name", name)
    }
  }, [name])

  const Notifications = dynamic(() =>
    import("../components/Notifications").then((mod) => mod.Notifications),
  )

  return (
    <RoomServiceProvider
      clientParameters={{
        auth: "/api/roomservice",
      }}
    >
      <NameContext.Provider value={[name, setName]}>
        {serviceWorkerRegistered && <Notifications />}
        <Component {...pageProps} />
      </NameContext.Provider>
    </RoomServiceProvider>
  )
}
