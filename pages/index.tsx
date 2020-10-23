import { IndexComponent } from "components/IndexComponent"
import { NameForm } from "components/NameForm"
import { Title } from "components/Title"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"

const Index = () => {
  const [id, setId] = useState<string | undefined>()

  useEffect(() => {
    setId(nanoid(5))
  }, [])

  return (
    <>
      <Title />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid gap-4">
        <div className="prose max-w-none">
          <h1 className="text-center">Planwirtschaft</h1>
        </div>
        <NameForm />
        <div className="grid place-items-center h-screen">
          {id && <IndexComponent id={id} />}
        </div>
      </div>
    </>
  )
}

export default Index
