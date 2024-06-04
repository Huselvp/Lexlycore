import { useState } from "react";
import "./styles/addFormStyles.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

function AddNewForm() {
  const [choices, setChoices] = useState([]);
  const [choice, setChoice] = useState("");
  const [options, setOptions] = useState([]);
  const [option, setOption] = useState("");
  const [blocs, setBlocs] = useState([]);

  // #######################

  const [isAddFormTitleOpen, setIsAddFormTitleOpen] = useState(true);

  const [isBlocsOpen, setIsBlocsOpen] = useState(false);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [isAddInputsOpen, setIsAddInputsOpen] = useState(false);

  const [isAddChoicesOpen, setIsAddChoicesOpen] = useState(false);

  const [isEditChoiceOpen, setIsEditChoiceOpen] = useState(false);

  const [isAddCheckBoxOptionsOpen, setIsAddCheckBoxOptionOpen] =
    useState(false);

  const [isEditCheckBoxOptionOpen, setIsEditCheckBoxOptionOpen] =
    useState(false);

  // ######################

  const [formTitle, setFormTitle] = useState("");

  const [blocInputLabel, setBlocInputLabel] = useState("");

  const [blocInputType, setBlocInputType] = useState("");

  // #######################

  const add_input_handler = () => {
    setIsAddInputsOpen(true);

    setIsPopUpOpen(true);

    setIsAddChoicesOpen(false);

    setIsEditChoiceOpen(false);

    setIsAddCheckBoxOptionOpen(false);

    setIsEditCheckBoxOptionOpen(false);
  };

  const DefualtBloc = ({ id, properties }) => {
    return (
      <div className="bloc-inputs">
        <button onClick={add_input_handler}>Add new inputs</button>
      </div>
    );
  };

  const addNewBlocHandler = () => {
    const newBloc = {
      id: Date.now(),
      inputs: [],
    };
    setBlocs([...blocs, newBloc]);
  };

  const add_form_title_handler = () => {
    if (formTitle !== "") {
      setIsBlocsOpen(true);
      setIsAddFormTitleOpen(false);
    } else {
      return;
    }
  };

  const add_choices_handler = () => {
    setIsAddInputsOpen(false);

    setIsAddChoicesOpen(true);

    setIsEditChoiceOpen(false);

    setIsAddCheckBoxOptionOpen(false);

    setIsEditCheckBoxOptionOpen(false);
  };

  const edit_choice_handler = () => {
    setIsAddInputsOpen(false);

    setIsAddChoicesOpen(false);

    setIsEditChoiceOpen(true);

    setIsAddCheckBoxOptionOpen(false);

    setIsEditCheckBoxOptionOpen(false);
  };

  const add_checkbox_options_handler = () => {
    setIsAddInputsOpen(false);

    setIsAddChoicesOpen(false);

    setIsEditChoiceOpen(false);

    setIsAddCheckBoxOptionOpen(true);

    setIsEditCheckBoxOptionOpen(false);
  };

  const edit_checkbox_option = () => {
    setIsAddInputsOpen(false);

    setIsAddChoicesOpen(false);

    setIsEditChoiceOpen(false);

    setIsAddCheckBoxOptionOpen(false);

    setIsEditCheckBoxOptionOpen(true);
  };

  const submit_edit_choice = () => {
    setIsAddInputsOpen(false);

    setIsAddChoicesOpen(false);

    setIsEditChoiceOpen(false);

    setIsAddCheckBoxOptionOpen(true);

    setIsEditCheckBoxOptionOpen(false);
  };

  const submit_choices_handler = () => {
    setIsAddInputsOpen(false);

    setIsAddChoicesOpen(false);

    setIsEditChoiceOpen(false);

    setIsAddCheckBoxOptionOpen(false);

    setIsEditCheckBoxOptionOpen(false);

    setIsBlocsOpen(true);
  };

  const submit_options_handler = () => {
    setIsAddInputsOpen(false);

    setIsAddChoicesOpen(false);

    setIsEditChoiceOpen(false);

    setIsAddCheckBoxOptionOpen(false);

    setIsEditCheckBoxOptionOpen(false);

    setIsBlocsOpen(true);
  };

  const create_new_input_handler = () => {
    if (blocInputLabel !== "" && blocInputType !== "") {
      switch (blocInputType) {
        case "text":
          setIsBlocsOpen(true);
          break;
        case "number":
          setIsBlocsOpen(true);
          break;
        case "date":
          setIsBlocsOpen(true);
          break;
        case "select":
          add_choices_handler();
          break;
        case "checkbox":
          add_checkbox_options_handler();
          break;
      }
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

      {isBlocsOpen && (
        <div className="blocs-container">
          {blocs.map((bloc) => (
            <DefualtBloc
              key={bloc.id}
              id={bloc.id}
              properties={bloc.properties}
            />
          ))}
          <div className="add-new-bloc">
            <button onClick={addNewBlocHandler}>Add new bloc</button>
          </div>
        </div>
      )}

      <div
        className={
          isPopUpOpen
            ? "add-inputs-container-popup active"
            : "add-inputs-container-popup"
        }
      >
        {isAddInputsOpen && (
          <div className="add-inputs-container">
            <IoMdClose
              className="close-btn"
              onClick={() => {
                setIsPopUpOpen(false);
              }}
            />
            <form>
              <label htmlFor="inputName">Input name</label>
              <input
                name="inputName"
                onChange={(e) => {
                  setBlocInputLabel(e.target.value);
                }}
                placeholder="Enter the input name"
                type="text"
              ></input>
              <label htmlFor="inputType">Input type</label>
              <select
                name="inputType"
                onChange={(e) => {
                  setBlocInputType(e.target.value);
                }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
                <option value="select">Select</option>
              </select>
              <button type="button" onClick={create_new_input_handler}>
                Add
              </button>
            </form>
          </div>
        )}

        {isAddChoicesOpen && (
          <div className="choices-container">
            <label>Your Choices</label>
            <input
              onChange={(e) => {
                setChoice(e.target.value);
              }}
              type="text"
              value={choice}
              placeholder="Enter your choices"
            ></input>

            {choices.length !== 0 &&
              choices.map((choice, index) => (
                <div className="choice" key={index}>
                  <p>{choice}</p>
                  <div className="btns">
                    <RiDeleteBin6Line className="btn" onClick={() => {}} />
                    <FaRegEdit className="btn" onClick={edit_choice_handler} />
                  </div>
                </div>
              ))}

            <div className="btns">
              <button
                type="button"
                onClick={() => {
                  if (choice !== "") {
                    setChoices((prev) => [...prev, choice]);
                    setChoice("");
                  }
                }}
              >
                Add
              </button>
              <button type="button" onClick={submit_choices_handler}>
                Done
              </button>
            </div>
          </div>
        )}

        {isEditChoiceOpen && (
          <div className="edit-choice-container">
            <label>Edit choice</label>
            <input
              type="text"
              placeholder="here I should put the value of the choice"
            ></input>
            <button type="button">Edit</button>
          </div>
        )}

        {isAddCheckBoxOptionsOpen && (
          <div className="choices-container">
            <label>Your Options</label>
            <input
              onChange={(e) => {
                setOption(e.target.value);
              }}
              type="text"
              value={option}
              placeholder="Enter your choices"
            ></input>

            {options.length !== 0 &&
              options.map((option, index) => (
                <div className="choice" key={index}>
                  <p>{option}</p>
                  <div className="btns">
                    <RiDeleteBin6Line className="btn" />
                    <FaRegEdit className="btn" onClick={edit_checkbox_option} />
                  </div>
                </div>
              ))}

            <div className="btns">
              <button
                type="button"
                onClick={() => {
                  if (option !== "") {
                    setOptions((prev) => [...prev, option]);
                    setOption("");
                  }
                }}
              >
                Add
              </button>
              <button type="button" onClick={submit_options_handler}>
                Done
              </button>
            </div>
          </div>
        )}

        {isEditCheckBoxOptionOpen && (
          <div className="edit-choice-container">
            <label>Edit option</label>
            <input
              type="text"
              placeholder="here I should put the value of the option"
            ></input>
            <button type="button" onClick={submit_edit_choice}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddNewForm;
