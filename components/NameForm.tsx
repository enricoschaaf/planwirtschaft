import { ChevronRight } from "heroicons/react/outline"
import { SyntheticEvent, useContext } from "react"
import { NameContext } from "utils/NameContext"

export const NameForm = () => {
  const [name, setName] = useContext(NameContext)

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      name: { value: string }
      reset: () => void
    }

    const name = target.name.value

    setName(name)

    target.reset()
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name" className="sr-only">
        Name
      </label>
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <input
            id="name"
            name="name"
            className="form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            placeholder={name ?? "Name"}
            autoComplete="off"
            required
          />
        </div>
        <button className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </form>
  )
}
