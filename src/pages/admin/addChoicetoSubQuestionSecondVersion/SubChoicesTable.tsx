import Menus from "../../../ui/Menus";
import Table from "../../../ui/Table";
import { extractChoicesFromString } from "../../../utils/helpers";
import { useSubQuestion } from "./useSubQuestion";
import SubChoicesRow from "./SubChoicesRow";

const SubChoicesTable = () => {
  const { question } = useSubQuestion();
  const choices = extractChoicesFromString(question!.valueType);

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
          render={(choice) => <SubChoicesRow key={choice.id} choice={choice} />}
        ></Table.Body>
      </Table>
    </Menus>
  );
};

export default SubChoicesTable;