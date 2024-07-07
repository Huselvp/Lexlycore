import React, { useState, useEffect } from "react";
import { API } from "../../../../utils/constants";
import { getApiConfig } from "../../../../utils/constants";
import axios from "axios";
import { IoIosAdd, IoIosClose } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

import { MdOutlineDone } from "react-icons/md";

import "./editBlock.css";

function EditBlock({ id, onSeeBlocksOpen, isBlocksOpen }) {
  const [blockData, setBlockData] = useState([]);
  const [newInputName, setNewInputName] = useState("");
  const [newInputType, setNewInputType] = useState("TEXT");
  const [isAddNewInputOpen, setIsAddNewInputOpen] = useState(false);
  const [isAddOptionsOpen, setIsAddOptionsOpen] = useState(false);
  const [isEditInputOpen, setIsEditInputOpen] = useState(false);
  const [inputToUpdateData, setInputToUpdateData] = useState({});
  const [options, setOptions] = useState([]);
  const [option, setOption] = useState("");
  const [isEditOptionsOpen, setIsEditOptionsOpen] = useState(false);

  const [upDatedInputName, setUpdatedInputName] = useState(
    inputToUpdateData.name
  );

  const [upDatedInputType, setUpdatedInputType] = useState(
    inputToUpdateData.type
  );

  const [updatedOptions, setUpdatedOptions] = useState({});

  const [newOption, setNewOption] = useState("");

  const getBlockData = async () => {
    try {
      await axios
        .get(`${API}/form/block/label/${id}`, getApiConfig())
        .then((result) => {
          setBlockData(result.data);
          console.log(result.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlockData();
  }, []);

  const add_new_input_handler = async () => {
    try {
      if (setNewInputName !== "") {
        await axios
          .post(
            `${API}/form/block/label/${id}`,
            { name: newInputName, type: newInputType },
            getApiConfig()
          )
          .then((result) => {
            localStorage.setItem("selectedInputId", result.data.id);
          })
          .then(() => {
            getBlockData();
          })
          .then(() => {
            if (newInputType === "SELECT") {
              when_add_options_open();
            } else {
              setIsAddNewInputOpen(false);

              setNewInputName("");
            }
          });
      }
    } catch (err) {
      console.error("Error adding input:", err);
    }
  };

  const handle_the_select_type_input = async (id) => {
    try {
      axios
        .post(`${API}/form/block/label/options/${id}`, options, getApiConfig())
        .then((result) => {
          setIsAddNewInputOpen(false);
          setIsAddOptionsOpen(false);

          getBlockData();
          setOptions([]);
          setNewInputName("");
          setNewInputType("");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const when_add_options_open = () => {
    setIsAddNewInputOpen(false);
    setIsAddOptionsOpen(true);
  };

  const delete_option_from_options = (option) => {
    const result = options.filter((e) => e !== option);
    setOptions(result);
    console.log("deleted");
  };

  const delete_input_handler = async (inputId) => {
    try {
      await axios
        .delete(`${API}/form/block/label/${id}/${inputId}`, getApiConfig())
        .then((result) => {
          console.log(result.data);
          getBlockData();
        });
    } catch (err) {
      console.log(err);
    }
  };

  const get_input_by_id = async (inputId) => {
    try {
      await axios
        .get(`${API}/form/block/label/${id}/${inputId}`, getApiConfig())
        .then((result) => {
          console.log(inputId);
          setInputToUpdateData(result.data);
          setUpdatedOptions(result.data.options);
          if (result.data.type === "SELECT") {
            setIsEditOptionsOpen(true);
          } else {
            setIsEditInputOpen(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const submit_updated_input_data = async (inputId) => {
    try {
      axios
        .put(
          `${API}/form/block/label/${id}/${inputId}`,
          { name: upDatedInputName, type: upDatedInputType, id: inputId },
          getApiConfig()
        )
        .then((result) => {
          console.log(result.data);

          if (upDatedInputType === "SELECT") {
            setIsAddOptionsOpen(true);
            setIsEditInputOpen(false);
          } else {
            getBlockData();
            setIsAddNewInputOpen(false);
            setIsAddOptionsOpen(false);
            setIsEditInputOpen(false);
            setUpdatedInputName("");
            setUpdatedInputType("");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const submit_updated_input_data_for_select_type = async (inputId) => {
    try {
      axios
        .put(
          `${API}/form/block/label/${id}/${inputId}`,
          { name: upDatedInputName, type: upDatedInputType, id: inputId },
          getApiConfig()
        )
        .then((result) => {
          console.log(result.data);

          getBlockData();
          setIsAddNewInputOpen(false);
          setIsAddOptionsOpen(false);
          setIsEditInputOpen(false);
          setIsEditOptionsOpen(false);
          setUpdatedInputName("");
          setUpdatedInputType("");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const delete_option_handler = async (id, key) => {
    try {
      axios
        .delete(`${API}/form/block/label/option/${id}/${key}`, getApiConfig())
        .then((result) => {
          console.log(result.data);
          get_input_by_id(id);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const add_new_option = async (id) => {
    try {
      if (newOption !== "") {
        axios
          .post(
            `${API}/form/block/label/options/${id}`,
            [newOption],
            getApiConfig()
          )
          .then((result) => {
            setOptions([]);
            console.log(result.data);
            get_input_by_id(id);
            setNewOption("");
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit-block-container">
      {blockData.length !== 0 &&
        isAddNewInputOpen === false &&
        isAddOptionsOpen === false &&
        isBlocksOpen === false &&
        isEditInputOpen === false &&
        isEditOptionsOpen === false && (
          <div className="form-container">
            {blockData.length !== 0 &&
              blockData.map((input, index) => (
                <form key={index}>
                  {input.type !== "SELECT" ? (
                    <React.Fragment>
                      <div className="labels-container changed">
                        <div className="text">
                          <p>Name:</p> <p>{input.name}</p>
                        </div>

                        <div className="frm">
                          {/* <input type={input.type}></input> */}
                          <p>Type :{input.type}</p>
                          <div className="admin_inputs_controlers">
                            <CiEdit
                              size={30}
                              className="icon"
                              style={{ marginRight: "1rem" }}
                              onClick={() => {
                                get_input_by_id(input.id);
                                localStorage.setItem(
                                  "selectedInputId",
                                  input.id
                                );
                              }}
                            />
                            <MdDeleteOutline
                              className="icon delete"
                              size={30}
                              onClick={() => {
                                delete_input_handler(input.id);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <label>Name: {input.name}</label>
                      {Object.keys(input.options).length !== 0 && (
                        <div className="frm">
                          <select>
                            {Object.entries(input.options).map(
                              ([key, value]) => (
                                <option key={key} value={value}>
                                  {value}
                                </option>
                              )
                            )}
                          </select>
                          <CiEdit
                            size={30}
                            className="icon"
                            style={{ marginRight: "1rem" }}
                            onClick={() => {
                              get_input_by_id(input.id);
                              localStorage.setItem("selectedInputId", input.id);
                            }}
                          />
                          <MdDeleteOutline
                            className="icon delete"
                            size={30}
                            onClick={() => {
                              delete_input_handler(input.id);
                            }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </form>
              ))}

            <div className="add-new-input">
              <button
                type="button"
                onClick={() => {
                  setIsAddNewInputOpen(true);
                }}
              >
                <IoIosAdd />
              </button>
              <button type="button" onClick={onSeeBlocksOpen}>
                Back
              </button>
            </div>
          </div>
        )}

      {blockData.length === 0 && (
        <div className="add-input">
          <form>
            <label htmlFor="inputName">Input name</label>
            <input
              name="inputName"
              placeholder="Enter the input name"
              type="text"
              onChange={(e) => {
                setNewInputName(e.target.value);
              }}
            ></input>
            <label htmlFor="inputType">Input type</label>
            <select
              name="inputType"
              value={newInputType}
              onChange={(e) => {
                setNewInputType(e.target.value);
              }}
            >
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="DATE">Date</option>
              <option value="SELECT">Select</option>
            </select>
            <div className="add-new-input">
              <button
                type="button"
                onClick={() => {
                  if (newInputName !== "") {
                    add_new_input_handler();
                  }
                }}
              >
                <IoIosAdd />
              </button>

              <button type="button" onClick={onSeeBlocksOpen}>
                Back
              </button>
            </div>
          </form>
        </div>
      )}

      {isAddNewInputOpen === true && (
        <div className="add-input">
          <form>
            <label htmlFor="inputName">Input name</label>
            <input
              name="inputName"
              placeholder="Enter the input name"
              type="text"
              onChange={(e) => {
                setNewInputName(e.target.value);
              }}
            ></input>
            <label htmlFor="inputType">Input type</label>
            <select
              name="inputType"
              value={newInputType}
              onChange={(e) => {
                setNewInputType(e.target.value);
              }}
            >
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="DATE">Date</option>
              <option value="SELECT">Select</option>
              <option value="filter">Filter</option>
            </select>
            <div className="add-new-input">
              <button
                type="button"
                onClick={() => {
                  if (newInputName !== "") {
                    add_new_input_handler();
                  }
                }}
              >
                <IoIosAdd />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (blockData.length === 0) {
                    onSeeBlocksOpen();
                  }
                  setIsAddOptionsOpen(false);
                  setIsAddNewInputOpen(false);
                }}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      )}

      {isAddOptionsOpen && (
        <div>
          <form>
            <label>Enter your options</label>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                setOption(e.target.value);
              }}
            ></input>
          </form>

          <div className="options">
            {options.length !== 0 &&
              options.map((option) => {
                return (
                  <p>
                    {option}
                    <span
                      onClick={() => {
                        delete_option_from_options(option);
                      }}
                    >
                      <MdDeleteOutline />
                    </span>
                  </p>
                );
              })}
          </div>

          <div className="add-new-input">
            <button
              type="button"
              onClick={() => {
                if (option !== "") {
                  setOptions((prev) => [...prev, option]);
                  setOption("");
                }
              }}
            >
              <IoIosAdd />
            </button>
            <button
              type="button"
              onClick={() => {
                handle_the_select_type_input(
                  localStorage.getItem("selectedInputId")
                );
              }}
            >
              <MdOutlineDone />
            </button>
            <button
              type="button"
              onClick={() => {
                delete_input_handler(localStorage.getItem("selectedInputId"));
                setIsAddNewInputOpen(false);
                setIsAddOptionsOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isEditInputOpen && (
        <div className="edit-input-container">
          <form>
            <div className="select">
              <label>Update label</label>
              <input
                value={upDatedInputName}
                onChange={(e) => {
                  setUpdatedInputName(e.target.value);
                }}
              ></input>
            </div>
            <div className="select">
              <label>Update Type</label>
              <select
                onChange={(e) => {
                  setUpdatedInputType(e.target.value);
                }}
              >
                <option value="TEXT">Text</option>
                <option value="NUMBER">Number</option>
                <option value="DATE">Date</option>
                <option value="SELECT">Select</option>
              </select>
            </div>
          </form>

          <div className="add-new-input">
            <button
              type="button"
              onClick={() => {
                submit_updated_input_data(inputToUpdateData.id);
              }}
            >
              <IoIosAdd />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddNewInputOpen(false);
                setIsAddOptionsOpen(false);
                setIsEditInputOpen(false);
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {isEditOptionsOpen && (
        <div className="edit-options">
          <form>
            <div>
              <label>Input Name</label>
              <input
                value={upDatedInputName}
                onChange={(e) => {
                  setUpdatedInputName(e.target.value);
                }}
              ></input>
            </div>

            <div className="select">
              <label>Input Type</label>

              <select
                value={upDatedInputType}
                onChange={(e) => {
                  setUpdatedInputType(e.target.value);
                }}
              >
                <option value="TEXT">Text</option>
                <option value="NUMBER">Number</option>
                <option value="DATE">Date</option>
                <option value="SELECT">Select</option>
              </select>
            </div>

            <div>
              <label>Enter new options</label>
              <input
                type="text"
                value={newOption}
                onChange={(e) => {
                  setNewOption(e.target.value);
                }}
              ></input>

              <div className="add-new-input">
                <button
                  type="button"
                  onClick={() => {
                    add_new_option(localStorage.getItem("selectedInputId"));
                  }}
                >
                  <IoIosAdd />
                </button>
              </div>
            </div>

            <div>
              <label>Options</label>
              <div>
                {updatedOptions &&
                  Object.keys(updatedOptions).length !== 0 &&
                  Object.entries(updatedOptions).map(([key, value]) => (
                    <div key={key} value={value} className="edit-option">
                      {value}{" "}
                      <MdDeleteOutline
                        className="icon"
                        onClick={() => {
                          delete_option_handler(
                            localStorage.getItem("selectedInputId"),
                            key
                          );
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </form>

          <div className="add-new-input">
            <button
              type="button"
              onClick={() => {
                setIsAddNewInputOpen(false);
                setIsAddOptionsOpen(false);
                setIsEditInputOpen(false);
                setIsEditOptionsOpen(false);
              }}
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => {
                submit_updated_input_data_for_select_type(
                  localStorage.getItem("selectedInputId")
                );
              }}
            >
              <MdOutlineDone />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditBlock;
