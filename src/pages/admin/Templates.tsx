import { useNavigate } from "react-router-dom"
import TemplatesTable from "../../features/Templates/TemplatesTable"
import { useTemplates } from "../../features/Templates/useTemplates"
import Button from "../../ui/Button"
import FeaturesHeader from "../../ui/FeaturesHeader"
import Modal from "../../ui/Modal"
import Spinner from "../../ui/Spinner"
const Templates = () => {
  const navigate = useNavigate()
  const { isLoading, isError } = useTemplates()
  if (isLoading) return <Spinner />
  if (isError) return <div>Something went wrong</div>

  return (
    <Modal>
      <FeaturesHeader>
        <h2>Templates</h2>
        <Button
          size="medium"
          variation="priamry"
          onClick={() => navigate("/a/templates/addTemplate")}
        >
          Add Template
        </Button>
      </FeaturesHeader>
      <TemplatesTable />
    </Modal>
  )
}

export default Templates
