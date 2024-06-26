import React from "react";
import "./addNewBlock.css";
import { IoIosAdd } from "react-icons/io";

function AddNewBlock({ onCreateNewBlock }) {
  return (
    <div className="add-new-block" onClick={onCreateNewBlock}>
      <IoIosAdd size={70} className="icon" />
    </div>
  );
}

export default AddNewBlock;
