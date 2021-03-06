import Link from "next/link"
import { useContext } from "react"
import { NameContext } from "utils/NameContext"

export const CreateGameButton = ({ id }: { id: string }) => {
  const [name] = useContext(NameContext)
  return (
    <span className="inline-flex rounded-md shadow-sm">
      <Link href={`/${id}`}>
        <a
          onClick={async () => {
            await fetch("/api/notifications", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, name }),
            })
          }}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
        >
          Spiel erstellen
        </a>
      </Link>
    </span>
  )
}
