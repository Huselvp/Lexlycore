import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import { formatCurrency } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import Modal from "../../ui/Modal";
import ConfirmDeleteTemplate from "./ConfirmDeleteTemplate";
import { BiCategory as CategoriesIcon } from "react-icons/bi";
import AssignUpdateCategory from "../Categories/AssignUpdateCategory";

const TemplatesRow = ({
  template,
  onMobile,
}: {
  template: Template;
  onMobile: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <Table.Row id={`menus-row--${template.id}`}>
      <div></div>
      <div className="hideOverflow">{template.templateName}</div>
      {!onMobile && (
        <>
          <div className="hideOverflow">
            {template.subcategory?.categoryType || " — "}
          </div>
          <div className="hideOverflow">
            {template.subcategory?.name || " — "}
          </div>
        </>
      )}
      <div className="hideOverflow">{formatCurrency(+template.cost)}</div>
      <Menus.Toggle id={String(template.id)} />
      <Menus.List id={String(template.id)}>
        {template.subcategory !== null && (
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`${template.id}`)}
          >
            See Questions
          </Menus.Button>
        )}
        <Modal.Open opens={`assign-category-${template.id}`}>
          <Menus.Button icon={<CategoriesIcon />}>
            {template.subcategory === null
              ? "Assign Subcategory"
              : "Edit Subcategory"}
          </Menus.Button>
        </Modal.Open>
        <Menus.Button
          icon={<HiPencil />}
          onClick={() => navigate(`/a/templates/editTemplate/${template.id}`)}
        >
          Edit
        </Menus.Button>

        <Modal.Open opens={`delete-template-${template.id}`}>
          <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
        </Modal.Open>
      </Menus.List>
      <Modal.Window name={`delete-template-${template.id}`}>
        <ConfirmDeleteTemplate templateId={template.id} />
      </Modal.Window>
      <Modal.Window name={`assign-category-${template.id}`}>
        <AssignUpdateCategory
          onAssign={!template.subcategory}
          templateId={template.id}
        />
      </Modal.Window>
    </Table.Row>
  );
};

export default TemplatesRow;
// import { HiEye, HiPencil, HiTrash } from "react-icons/hi2"
// import Menus from "../../ui/Menus"
// import Table from "../../ui/Table"
// import { formatCurrency } from "../../utils/helpers"
// import { useNavigate } from "react-router-dom"
// import Modal from "../../ui/Modal"
// import AddEditTemplate from "./AddEditTemplate"
// import ConfirmDeleteTemplate from "./ConfirmDeleteTemplate"
// import { BiCategory as CategoriesIcon } from "react-icons/bi"
// import AssignUpdateCategory from "../Categories/AssignUpdateCategory"

// const TemplatesRow = ({ template }: { template: Template }) => {
//   const navigate = useNavigate()
//   return (
//     <Table.Row id={`menus-row--${template.id}`}>
//       {/* <Table.Link to={`/templates/${template.id}`}>
//         <span>See Questions</span>
//       </Table.Link> */}
//       <div></div>
//       <div className="hideOverflow">{template.templateName}</div>
//       <div className="hideOverflow">{template.subcategory?.name || " — "}</div>
//       <div className="hideOverflow">{formatCurrency(+template.cost)}</div>
//       <Menus.Toggle id={String(template.id)} />
//       <Menus.List id={String(template.id)}>
//         <Menus.Button
//           icon={<HiEye />}
//           onClick={() => navigate(`${template.id}`)}
//         >
//           See Questions
//         </Menus.Button>
//         <Modal.Open opens={`assign-category-${template.id}`}>
//           <Menus.Button icon={<CategoriesIcon />}>
//             {!template.subcategory ? "Assign Category" : "Edit Category"}
//           </Menus.Button>
//         </Modal.Open>
//         <Modal.Open opens={`edit-template-${template.id}`}>
//           <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
//         </Modal.Open>
//         <Modal.Open opens={`delete-template-${template.id}`}>
//           <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
//         </Modal.Open>
//       </Menus.List>
//       <Modal.Window name={`edit-template-${template.id}`}>
//         <AddEditTemplate onAdd={false} template={template} />
//       </Modal.Window>
//       <Modal.Window name={`delete-template-${template.id}`}>
//         <ConfirmDeleteTemplate templateId={template.id} />
//       </Modal.Window>
//       <Modal.Window name={`assign-category-${template.id}`}>
//         <AssignUpdateCategory
//           onAssign={!template.subcategory}
//           templateId={template.id}
//         />
//       </Modal.Window>
//     </Table.Row>
//   )
// }

// export default TemplatesRow
