import Link from "next/link"

export const CreateGameButton = ({ id }: { id: string }) => {
  return (
    <span className="inline-flex rounded-md shadow-sm">
      <Link href={`/${id}`}>
        <a className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
          Spiel erstellen
        </a>
      </Link>
    </span>
  )
}
