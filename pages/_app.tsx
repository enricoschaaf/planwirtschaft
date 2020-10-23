import { RoomServiceProvider } from "@roomservice/react"
import "../styles/index.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <RoomServiceProvider
      clientParameters={{
        auth: "/api/roomservice",
      }}
    >
      <Component {...pageProps} />
    </RoomServiceProvider>
  )
}
