import { createContext, Dispatch, SetStateAction } from "react"

export const NameContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>(undefined)
