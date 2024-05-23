import Menus from "../../../../ui/Menus"
import Table from "../../../../ui/Table"
import { extractChoicesFromString } from "../../../../utils/helpers"
import { useQuestion } from "../useQuestion"
import ChoicesRow from "./ChoicesRow"

const ChoicesTable = () => {
  const { question } = useQuestion()
  const choices = extractChoicesFromString(question!.valueType)
  console.log(choices)
  return (
    <Menus>
      <Table columns="1.5rem 1fr 1fr 3rem">
        <Table.Header>
          <div>#</div>
          <div>Related text</div>
          <div>Choice</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={choices}
          render={(choice) => <ChoicesRow key={choice.id} choice={choice} />}
        ></Table.Body>
      </Table>
    </Menus>
  )
}

export default ChoicesTable
