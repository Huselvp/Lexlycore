import "./addNewBlock.css";
import { IoIosAdd } from "react-icons/io";

function AddNewBlock({ openBlockType }) {
  return (
    <div className="add-new-block" onClick={openBlockType}>
      <IoIosAdd size={70} className="icon" />
    </div>
  );
}

export default AddNewBlock;
