import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiConfig } from "../../../../utils/constants";
import { API } from "../../../../utils/constants";
import axios from "axios";
import Table from "../../../../ui/Table";
import Menus from "../../../../ui/Menus";
import Modal from "../../../../ui/Modal";
import ConfirmDeleteSubQuestion from "../../../../features/Templates/Questions/ConfirmDeleteSubQuestion";
import { HiPencil, HiTrash, HiEye } from "react-icons/hi2";
import { MdDone } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { HiOutlineDuplicate } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdRemove } from "react-icons/io";

import PopUp from "../../../admin/components/popUp/PopUp";
import PopUpContentContainer from "../../../admin/components/popup_content_container/PopUpContantContainer";
import Form from "../../../admin/components/UI/form/Form";
import Button from "../../../admin/components/UI/btns/Button";
import Block from "../../../admin/components/block/block";
import AddNewBlock from "../../../admin/components/addNewBlock/AddNewBlock";
import BlocksContainer from "../../../admin/components/blocksContainer/BlocksContainer";
import EditBlock from "../../../admin/components/editBlock/editBlock";

function SubQuestionRow({ subQuestion, questionId }) {
  const navigate = useNavigate();

  // popups controllers

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [isAddSubQuestionFormNameOpen, setIsAddSubQuestionFormNameOpen] =
    useState(false);

  const [isSeeSubQuestionFormBlocksOpen, setIsSeeSubQuestionBlocks] =
    useState(false);

  const [isEditSubQuestionBlocksOpen, setIsEditSubQuestionBlocksOpen] =
    useState(false);

  const [isSeeAlSubQuestionBlocksOpen, setIsSeeAllSubQuestionBlocksOpen] =
    useState(false);

  // SubQuestion data

  const [subQuestionFormTitle, setSubQuestionFormTitle] = useState("");

  const [subQuestionFormBlocks, setSubQuestionFormBlocks] = useState([]);

  const [subQuestionFormId, setSubQuestionFormId] = useState("");

  const [subQuestionBlockId, setSubQuestionBlockId] = useState("");

  const createSubQuestionFormHandler = async () => {
    try {
      if (subQuestionFormTitle !== "") {
        await axios
          .post(
            `${API}/form/create-sub/${subQuestion.id}`,
            { title: subQuestionFormTitle },
            getApiConfig()
          )
          .then((result) => {
            setIsAddSubQuestionFormNameOpen(false);
            setIsSeeSubQuestionBlocks(true);
            getSubQuestionFormBlocksHandler(subQuestionFormId);
          });
      } else {
        console.log("form title should not be empty");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getSubQuestionFormId = async (id) => {
    try {
      await axios
        .get(`${API}/form/get-by-sub-question-id/${id}`, getApiConfig())
        .then((result) => {
          if (typeof result.data === "number") {
            setSubQuestionFormId(`${result.data}`);
            getSubQuestionFormBlocksHandler(result.data);
          } else {
            setSubQuestionFormId("");
            return;
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSubQuestionFormId(subQuestion.id);
  }, [subQuestion.id]);

  const getSubQuestionFormBlocksHandler = async (id) => {
    try {
      await axios
        .get(`${API}/form/blocks/${id}`, getApiConfig())
        .then((result) => {
          if (result.data.length !== 0) {
            setSubQuestionFormBlocks(result.data);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSubQuestionFormBlocksHandler(subQuestionFormId);
  }, [subQuestionFormId]);

  const create_subQuestion_new_block_handler = async () => {
    try {
      await axios
        .post(`${API}/form/block/${subQuestionFormId}`, {}, getApiConfig())
        .then((result) => {
          getSubQuestionFormBlocksHandler(subQuestionFormId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const delete_subQuestion_block_handler = async (id) => {
    try {
      await axios
        .delete(`${API}/form/block/${subQuestionFormId}/${id}`, getApiConfig())
        .then((result) => {
          getSubQuestionFormBlocksHandler(subQuestionFormId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const duplicate_subQuestion_block_handler = async (id) => {
    try {
      await axios
        .post(
          `${API}/form/block/duplicate/${subQuestionFormId}/${id}`,
          {},
          getApiConfig()
        )
        .then((result) => {
          getSubQuestionFormBlocksHandler(subQuestionFormId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  // ==============================

  const [isAddMaxMinValuesOpen, setIsAddMaxMinValuesOpen] = useState(false);

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const add_min_max_value_handler = async () => {
    if (minValue == null || (maxValue == null && minValue < maxValue)) {
      console.error("minValue or maxValue is not defined");
      return;
    }

    try {
      await axios
        .post(
          `${API}/filter/add-subQuestion/${subQuestion.id}`,
          {
            filterStart: `${minValue}`,
            filterEnd: `${maxValue}`,
          },
          getApiConfig()
        )
        .then((result) => {
          setIsPopUpOpen(false);
          setIsAddMaxMinValuesOpen(false);
          getFilterInformation(subQuestion?.id, subQuestion?.valueType);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const [isFilterHaveValue, setIsFilterHaveValue] = useState(false);
  const [filterData, setFilterData] = useState({});

  const getFilterInformation = async (id, type) => {
    if (type === "filter") {
      try {
        await axios
          .get(`${API}/filter/get-by-sub-question-id/${id}`, getApiConfig())
          .then((result) => {
            setIsFilterHaveValue(true);
            setFilterData(result.data);
          });
      } catch (err) {
        console.error(err);
        setIsFilterHaveValue(false);
      }
    }
  };

  useEffect(() => {
    getFilterInformation(subQuestion?.id, subQuestion?.valueType);
  }, [subQuestion?.id, subQuestion?.valueType]);

  const [isUpdateMaxMinValuesOpen, setIsUpdatedMaxMinValuesOpen] =
    useState(false);

  const [updatedMinValue, setUpdatedMinValue] = useState(0);
  const [updatedMaxValue, setUpdatedMaxValue] = useState(0);

  const updateMinMaxValuesHandler = async (id) => {
    try {
      if (
        updatedMaxValue !== 0 &&
        updatedMinValue !== 0 &&
        updatedMaxValue > updatedMinValue
      ) {
        await axios
          .put(
            `${API}/filter/update/${filterData.id}`,
            {
              filterStart: `${updatedMinValue}`,
              filterEnd: `${updatedMaxValue}`,
            },
            getApiConfig()
          )
          .then((result) => {
            setIsUpdatedMaxMinValuesOpen(false);
            setIsPopUpOpen(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <PopUp isOpen={isPopUpOpen}>
        <PopUpContentContainer
          onClose={() => {
            setIsPopUpOpen(false);
            setIsAddSubQuestionFormNameOpen(false);
            setIsEditSubQuestionBlocksOpen(false);
            setIsSeeAllSubQuestionBlocksOpen(false);
            setIsSeeSubQuestionBlocks(false);
          }}
        >
          <div>
            {isAddSubQuestionFormNameOpen && (
              <Form>
                <label>Add form name</label>
                <input
                  placeholder="Enter form name"
                  onChange={(e) => {
                    setSubQuestionFormTitle(e.target.value);
                  }}
                ></input>
                <div className="controllers">
                  <Button
                    type="button"
                    onClick={() => {
                      createSubQuestionFormHandler();
                    }}
                  >
                    <MdDone />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsPopUpOpen(false);
                      setIsAddSubQuestionFormNameOpen(false);
                    }}
                  >
                    <IoIosClose />
                  </Button>
                </div>
              </Form>
            )}

            {isSeeSubQuestionFormBlocksOpen && (
              <BlocksContainer>
                {subQuestionFormBlocks.map((block, index) => {
                  return (
                    <Block key={index}>
                      <div className="block-controlers">
                        <button>
                          <FaRegEdit
                            size={20}
                            onClick={() => {
                              setIsEditSubQuestionBlocksOpen(true);
                              setIsAddSubQuestionFormNameOpen(false);
                              setIsSeeAllSubQuestionBlocksOpen(false);
                              setIsSeeSubQuestionBlocks(false);
                              setSubQuestionBlockId(block.id);
                            }}
                          />
                        </button>
                        <button>
                          <HiOutlineDuplicate
                            size={20}
                            onClick={() => {
                              duplicate_subQuestion_block_handler(block.id);
                            }}
                          />
                        </button>
                        <button>
                          <MdDeleteOutline
                            size={20}
                            onClick={() => {
                              delete_subQuestion_block_handler(block.id);
                            }}
                          />
                        </button>
                      </div>
                    </Block>
                  );
                })}

                <AddNewBlock
                  onCreateNewBlock={create_subQuestion_new_block_handler}
                />
              </BlocksContainer>
            )}

            {isEditSubQuestionBlocksOpen && (
              <EditBlock
                onSeeBlocksOpen={() => {
                  setIsSeeSubQuestionBlocks(true);
                  setIsEditSubQuestionBlocksOpen(false);
                  setIsAddSubQuestionFormNameOpen(false);
                }}
                isBlocksOpen={isSeeSubQuestionFormBlocksOpen}
                id={subQuestionBlockId}
              />
            )}

            {isSeeAlSubQuestionBlocksOpen && (
              <div className="form_type">
                {subQuestionFormBlocks.map((block, blockIndex) => {
                  return (
                    <div className="form-block-user" key={block.id}>
                      <IoIosClose className="form_type_controllers" size={20} />

                      {block.labels.map((label, labelIndex) => {
                        return (
                          <div key={label.id} className="block-input">
                            <label>{label.name}</label>
                            {label.type === "SELECT" ? (
                              <select name={label.name}>
                                {Object.keys(label.options).map((key) => (
                                  <option key={key} value={key}>
                                    {label.options[key]}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={label.type}
                                name={label.name}
                                placeholder={label.name}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {isAddMaxMinValuesOpen && (
              <div>
                <form>
                  <input
                    type="number"
                    placeholder="Enter min value"
                    onChange={(e) => {
                      setMinValue(e.target.value);
                    }}
                  ></input>
                  <input
                    type="number"
                    placeholder="Enter max value"
                    onChange={(e) => {
                      setMaxValue(e.target.value);
                    }}
                  ></input>
                </form>

                <div className="controllers">
                  <Button
                    type="button"
                    onClick={() => {
                      add_min_max_value_handler(subQuestion.id);
                    }}
                  >
                    <MdDone />
                  </Button>
                </div>
              </div>
            )}

            {isUpdateMaxMinValuesOpen && (
              <div>
                <form>
                  <input
                    type="number"
                    placeholder="Enter min value"
                    onChange={(e) => {
                      setUpdatedMinValue(e.target.value);
                    }}
                  ></input>
                  <input
                    type="number"
                    placeholder="Enter max value"
                    onChange={(e) => {
                      setUpdatedMaxValue(e.target.value);
                    }}
                  ></input>
                </form>

                <div className="controllers">
                  <Button
                    type="button"
                    onClick={() => {
                      updateMinMaxValuesHandler(subQuestion.id);
                    }}
                  >
                    <MdDone />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopUpContentContainer>
      </PopUp>

      <Table.Row id={`menus-row--sq--${subQuestion.id}`}>
        <div></div>
        <div
          className="hideOverflow questionColor"
          style={{ marginLeft: "35px", color: "#646464" }}
        >
          {subQuestion.questionText}
        </div>
        <div
          className="hideOverflow questionColor"
          style={{ marginLeft: "35px", color: "#646464" }}
        >
          {subQuestion.Description}
        </div>
        <Menus.Toggle id={String(subQuestion.id)} />
        {/* this is the button who open the subList*/}
        <Menus.ListSub id={String(subQuestion.id)}>
          <Menus.Button
            icon={<HiPencil />}
            onClick={() => {
              navigate(`editSubQuestion/${questionId}/${subQuestion.id}`);
            }}
          >
            Edit SubQuestion
          </Menus.Button>

          {subQuestion.valueType === "form" &&
            (subQuestionFormBlocks.length === 0 ? (
              <Menus.Button
                icon={<HiPencil />}
                onClick={() => {
                  setIsPopUpOpen(true);
                  setIsAddSubQuestionFormNameOpen(true);
                }}
              >
                Add form
              </Menus.Button>
            ) : (
              <Menus.Button
                icon={<HiPencil />}
                onClick={() => {
                  setIsPopUpOpen(true);
                  setIsSeeSubQuestionBlocks(true);
                }}
              >
                See blocks
              </Menus.Button>
            ))}

          {subQuestion.valueType.startsWith("checkbox") && (
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`${subQuestion.id}`)}
            >
              See Choices
            </Menus.Button>
          )}

          {subQuestion.valueType.startsWith("filter") &&
            (!isFilterHaveValue ? (
              <Menus.Button
                icon={<HiEye />}
                onClick={() => {
                  setIsAddMaxMinValuesOpen(true);
                  setIsPopUpOpen(true);
                  console.log("this is working");
                }}
              >
                Add min max values
              </Menus.Button>
            ) : (
              <Menus.Button
                icon={<HiEye />}
                onClick={() => {
                  setIsUpdatedMaxMinValuesOpen(true);
                  setIsPopUpOpen(true);
                  console.log("this is working");
                }}
              >
                Edit Min Max Values
              </Menus.Button>
            ))}

          <Modal.Open
            opens={`delete-subquestion-${subQuestion.id}-${questionId}`}
          >
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open>
        </Menus.ListSub>

        {/* {this is the window to confirm the delete} */}
        <Modal.Window
          name={`delete-subquestion-${subQuestion.id}-${questionId}`}
        >
          <ConfirmDeleteSubQuestion
            questionParentId={Number(questionId)}
            questionId={Number(subQuestion.id)}
          />
        </Modal.Window>
      </Table.Row>
    </React.Fragment>
  );
}

export default SubQuestionRow;
