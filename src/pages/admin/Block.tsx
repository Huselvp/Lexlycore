import React, { useState, useEffect } from "react";
import { getApiConfig } from "../../utils/constants";
import axios from "axios";
import "./styles/addFormStyles.css";
import { FiMoreVertical } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { IoDuplicateOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";

import Select from "./components/Select";

function Block(props) {
  const [blockData, setBlockData] = useState([]);
  const [isControllersOpen, setIsControllersOpen] = useState(false);
  const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);

  const [isAddOptionsOpen, setIsAddOptionsOpen] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [choices, setChoices] = useState([]);
  const [choice, setChoice] = useState("");

  const getBlockData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/form/block/label/${id}`,
        getApiConfig()
      );

      setBlockData(response.data);

      console.log(response.data, "from block");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBlockData(props.id);
  }, [props.id]);

  const handleAddInputClick = async (id) => {
    await props.onAddInputs(id);
    await getBlockData(id);
  };

  const delete_block_handler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/form/block/${props.formId}/${props.id}`,
        getApiConfig()
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    }

    console.log(props.id);
  };

  const handeling_input_type = (ex: string, label: string, id) => {
    switch (ex) {
      case "TEXT":
      case "NUMBER":
      case "DATE":
        return (
          <form>
            <label>{label}</label>
            <input type={ex}></input>
          </form>
        );
        break;
      case "SELECT":
        return <Select id={id} label={label} />;
        break;
    }
  };

  return (
    <React.Fragment>
      <div className="bloc-inputs">
        {Array.isArray(blockData) &&
          blockData.length > 0 &&
          blockData.map((input, index) => (
            <React.Fragment key={index}>
              {handeling_input_type(input.type, input.name, input.id)}
            </React.Fragment>
          ))}

        <button
          onClick={() => {
            handleAddInputClick(props.id);
            console.log(props.id);
          }}
        >
          Add new input
        </button>

        {blockData.length !== 0 && (
          <FiMoreVertical
            className="block-controllers"
            onClick={() => {
              setIsControllersOpen((prev) => !prev);
            }}
          />
        )}

        <div
          className={
            isControllersOpen === true
              ? "bloc-inputs-controllers active"
              : "bloc-inputs-controllers"
          }
        >
          <ul>
            <li onClick={delete_block_handler}>
              <RiDeleteBin6Line /> <span>Delete</span>
            </li>
            <li
              onClick={() => {
                setIsEditBlockOpen(true);
              }}
            >
              <CiEdit /> <span>Edit</span>
            </li>
            <li>
              <IoDuplicateOutline /> <span>Duplicate</span>
            </li>
          </ul>
        </div>

        <div
          className={
            isEditBlockOpen === true
              ? "edit-block-container active"
              : "edit-block-container"
          }
        >
          <div className="edit-block-settings">
            {blockData.length !== 0 &&
              blockData.map((input) => (
                <form>
                  <label>{input.name}</label>
                  <input type={input.type}></input>
                </form>
              ))}

            <IoMdClose
              className="close-btn"
              onClick={() => {
                setIsEditBlockOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={
          isPopUpOpen
            ? "add-inputs-container-popup active"
            : "add-inputs-container-popup"
        }
      >
        {isAddOptionsOpen && (
          <div className="choices-container">
            <IoMdClose
              onClick={() => {
                setIsAddOptionsOpen(false);
                setIsPopUpOpen(false);
              }}
              className="close"
            />
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
                    <FaRegEdit className="btn" />
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
              <button type="button">Done</button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default Block;
