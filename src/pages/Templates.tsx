import Header from "../ui/Header"
import { useTemplates } from "../features/Templates/useTemplates"
import Spinner from "../ui/Spinner"
import Footer from "../ui/Footer"
import TemplatesContent from "../features/Templates/TemplatesContent"
import ErrorMessage from "../ui/ErrorMessage"

const Templates = () => {
  const { isLoading, templates, isError } = useTemplates()
  console.log({ isLoading, templates })

  return (
    <>
      <Header />
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <TemplatesContent />
      )}
      <Footer />
    </>
  )
}

export default Templates
