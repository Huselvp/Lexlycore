import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import AddEditChoice from "./AddEditSubChoice";
import ConfirmDeleteSubChoice from "./ConfirmDeleteSubChoice";

const SubChoicesRow = ({ choice }: { choice: Choice }) => {
  return (
    <Table.Row id={`menus-row--${choice.id}`}>
      <div></div>
      <div className="hideOverflow">{choice.newRelatedText}</div>
      <div className="hideOverflow">{choice.choice}</div>
      <Menus.Toggle id={String(choice.id)} />
      <Menus.List id={String(choice.id)}>
        <Modal.Open opens={`edit-choice-${choice.id}`}>
          <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
        </Modal.Open>
        <Modal.Open opens={`delete-choice-${choice.id}`}>
          <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
        </Modal.Open>
      </Menus.List>
      <Modal.Window name={`edit-choice-${choice.id}`}>
        <AddEditChoice onAdd={false} choice={choice} />
      </Modal.Window>
      <Modal.Window name={`delete-choice-${choice.id}`}>
        <ConfirmDeleteSubChoice choiceId={choice.id} />
      </Modal.Window>
    </Table.Row>
  );
};

export default SubChoicesRow;
