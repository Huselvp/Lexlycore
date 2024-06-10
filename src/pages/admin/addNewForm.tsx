import { useState } from "react";
import axios from "axios";
import "./styles/addFormStyles.css";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { getApiConfig } from "../../utils/constants";

import { displayErrorMessage } from "../../utils/helpers";

function AddNewForm() {
  const { templateId, formId } = useParams<{ templateId: string }>();

  const navigate = useNavigate();

  const [isAddFormTitleOpen, setIsAddFormTitleOpen] = useState(true);

  const [formTitle, setFormTitle] = useState("");

  const add_form_title_handler = async () => {
    try {
      if (formTitle.trim() !== "") {
        await axios
          .post(
            `${import.meta.env.VITE_API}/form/create/${formId}`,
            { title: formTitle },
            getApiConfig()
          )
          .then((result) => {
            setIsAddFormTitleOpen(false);
            setFormTitle("");

            navigate(`/a/templates/${templateId}/seeBlocks/${formId}`);
          });
      } else {
        console.warn("Form title is empty");
        return;
      }
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
    <div className="container">
      <button className="back">
        <IoIosArrowRoundBack size={25} />
        <span>Back</span>
      </button>

      {isAddFormTitleOpen && (
        <form className="add-form-name-container">
          <label>Add form name</label>
          <input
            type="text"
            onChange={(e) => {
              setFormTitle(e.target.value);
            }}
          ></input>
          <button type="button" onClick={add_form_title_handler}>
            Create
          </button>
        </form>
      )}
    </div>
  );
}

export default AddNewForm;
