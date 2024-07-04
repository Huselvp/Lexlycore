import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
// import { FaCaretDown, FaCaretUp  } from "react-icons/fa";
import Menus from "../../../ui/Menus";
import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDeleteQuestion from "./ConfirmDeleteQuestion";
import React, { useEffect, useRef, useState } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import ConfirmDeleteSubQuestion from "./ConfirmDeleteSubQuestion";
import { Reorder, color } from "framer-motion";
import { useTemplate } from "../useTemplate";
import axios from "axios";
import { API, getApiConfig } from "../../../utils/constants";

import PopUp from "../../../pages/admin/components/popUp/PopUp";
import PopUpContentContainer from "../../../pages/admin/components/popup_content_container/PopUpContantContainer";
import Form from "../../../pages/admin/components/UI/form/Form";
import Button from "../../../pages/admin/components/UI/btns/Button";
import Block from "../../../pages/admin/components/block/block";
import AddNewBlock from "../../../pages/admin/components/addNewBlock/AddNewBlock";
import BlocksContainer from "../../../pages/admin/components/blocksContainer/BlocksContainer";
import EditBlock from "../../../pages/admin/components/editBlock/editBlock";

import { IoIosAdd, IoIosClose } from "react-icons/io";
import { HiOutlineDuplicate } from "react-icons/hi";

import { FaRegEdit } from "react-icons/fa";

import { MdDeleteOutline } from "react-icons/md";

import { MdDone } from "react-icons/md";

import SubQuestionForm from "../../../pages/admin/components/subQuestionFormPopUp/subQuestionForm";

const QuestionsRow = ({ question }: { question: Question }) => {
  const [formTitle, setFormTitle] = useState("");

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isAddFormNameOpen, setIsAddFormNameOpen] = useState(false);
  const [isSeeBlocksOpen, setIsSeeBlocksOpen] = useState(false);
  const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);
  const [formBlocksId, setFormBlocksId] = useState("");
  const [isTherBlocks, setIsTherBlocks] = useState(false);

  const [isAddMaxMinValuesOpen, setIsAddMaxMinValuesOpen] = useState(false);

  const [isSeeAllBlocksInpusOpen, setIsSeeAllBlocksInputOpen] = useState(false);

  const [blockId, setBlockId] = useState(0);

  const [caret_icon_active, setcaret] = useState(false);

  const navigate = useNavigate();

  const { templateId } = useParams<{ templateId: string }>();

  const [formBlocs, setFormBlocs] = useState([]);
  // const [subQuestionFormBlocks, setSubQuestionFormBlocks] = useState([]);
  const [isSubQuestionHaveForm, setIsSubQuestionHaveForm] = useState(false);

  const [squestionOrderTest, setSQuestionOrderTest] = useState(
    question?.subQuestions.sort((a, b) => a.position - b.position)
  );
  const squestionIds = squestionOrderTest.map((q) => q?.id);

  const handleReorder = (newOrder) => {
    setSQuestionOrderTest(newOrder);
  };

  const [formBlocksData, setFormBblocksData] = useState([]);

  // const [subQuestionFormBlocksData, setSubQuestionFormBlocksData] = useState(
  //   []
  // );

  useEffect(() => {
    console.log(question.subQuestions, "this is the subquestion");
  }, [question]);

  useEffect(() => {
    const reorderQuestions = async (squestionids: number[]) => {
      try {
        await axios.put(
          `${API}/admin/questions/subquestions/reorder/${question.id}`,
          squestionids,
          getApiConfig()
        );
      } catch (error) {
        console.error("Error reordering questions:", error);
      }
    };

    reorderQuestions(squestionIds);
  }, [squestionOrderTest]);

  useEffect(() => {
    setSQuestionOrderTest(question?.subQuestions);
  }, [question?.subQuestions]);

  const get_form_blocks_handler = async (id) => {
    try {
      await axios
        .get(`http://localhost:8081/api/form/blocks/${id}`, getApiConfig())
        .then((result) => {
          if (result.data.length !== 0) {
            setFormBlocs(result.data);
            setIsTherBlocks(true);
          } else {
            setIsTherBlocks(false);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const get_formId = async (id) => {
    try {
      await axios
        .get(`${API}/form/get-by-question-id/${id}`, getApiConfig())
        .then((result) => {
          if (typeof result.data === "number") {
            setFormBlocksId(result.data);
            get_form_blocks_handler(result.data);
          } else {
            setFormBlocksId("");

            return;
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchFormIds = async () => {
      await get_formId(question.id);
    };

    fetchFormIds();
  }, []);

  useEffect(() => {
    squestionOrderTest?.forEach((sq) => {
      // get_sub_q_blocks(sq.id);
      const get_sub_q_blocks = async (id) => {
        try {
          await axios
            .get(`http://localhost:8081/api/form/blocks/${id}`, getApiConfig())
            .then((result) => {
              // setFormBlocs(result.data);

              if (result.data.length !== 0) {
                setIsSubQuestionHaveForm(true);
                setSubQuestionFormBlocks(result.data);
                console.log(
                  result.data,
                  "this is the qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
                );
              } else {
                setIsSubQuestionHaveForm(false);
              }
            });
        } catch (err) {
          console.log(err);
        }
      };
      get_sub_q_blocks(sq.id);
    });
  }, [squestionOrderTest]);

  const submit_form_name_handler = async () => {
    try {
      if (formTitle !== "") {
        console.log(question.id);
        await axios
          .post(
            `${import.meta.env.VITE_API}/form/create/${question.id}`,
            { title: formTitle },
            getApiConfig()
          )
          .then((result) => {
            setIsAddFormNameOpen(false);
            setIsSeeBlocksOpen(true);
            get_form_blocks_handler(result.data.question.id);
          });
      } else {
        console.log("form title should not be empty");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const create_new_block_handler = async () => {
    try {
      await axios
        .post(`${API}/form/block/${formBlocksId}`, {}, getApiConfig())
        .then((result) => {
          console.log(result.data, "from add new block");
          get_form_blocks_handler(formBlocksId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const delete_block_handler = async (id) => {
    try {
      await axios
        .delete(`${API}/form/block/${formBlocksId}/${id}`, getApiConfig())
        .then((result) => {
          console.log(result.data);
          get_form_blocks_handler(formBlocksId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const duplicate_block_handler = async (id) => {
    try {
      await axios
        .post(
          `${API}/form/block/duplicate/${formBlocksId}/${id}`,
          {},
          getApiConfig()
        )
        .then((result) => {
          console.log(result.data);
          get_form_blocks_handler(formBlocksId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const get_form_blocks = async () => {
      try {
        await axios
          .get(`${API}/suser/${question.id}/details`, getApiConfig())
          .then((result) => {
            console.log(result.data.form.blocks);
            setFormBblocksData(result.data.form.blocks);
          });
      } catch (err) {
        console.log(err);
      }
    };

    get_form_blocks();
  }, [question.id]);

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const add_min_max_value_handler = async (id) => {
    if (minValue == null || (maxValue == null && minValue < maxValue)) {
      console.error("minValue or maxValue is not defined");
      return;
    }

    try {
      await axios
        .post(
          `${API}/filter/add-question/${id}`,
          {
            filterStart: `${minValue}`,
            filterEnd: `${maxValue}`,
          },
          getApiConfig()
        )
        .then((result) => {
          setIsPopUpOpen(false);
          setIsAddMaxMinValuesOpen(false);
          getFilterInformation(question?.id, question?.valueType);
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
          .get(`${API}/filter/get-by-question-id/${id}`, getApiConfig())
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
    getFilterInformation(question?.id, question?.valueType);
  }, [question?.id, question?.valueType]);

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

  // ===================================================

  // popups controllers
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

  const [subQuestionId, setSubQuestionId] = useState("8");

  const getSubQuestionId = (id) => {
    setSubQuestionId(id);
    console.log(id);
  };

  // subQuestion controllers

  const createSubQuestionFormHandler = async () => {
    try {
      if (subQuestionFormTitle !== "") {
        await axios
          .post(
            `${API}/form/create-sub/${subQuestionId}`,
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
    getSubQuestionFormId(subQuestionId);
  }, [subQuestionId]);

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
        .delete(
          `${API}/form/block/${subQuestionFormId}/${subQuestionId}`,
          getApiConfig()
        )
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

  const [isSubQuestionFormOpen, setIsSubQuestionFormOpen] = useState(false);

  return (
    <>
      <PopUp isOpen={isPopUpOpen}>
        <PopUpContentContainer
          onClose={() => {
            setIsPopUpOpen(false);
            setIsAddFormNameOpen(false);
            setIsSeeBlocksOpen(false);
            setIsEditBlockOpen(false);
          }}
          onSeeAllBlocks={() => {
            setIsSeeAllBlocksInputOpen(true);
            setIsAddFormNameOpen(false);
            setIsSeeBlocksOpen(false);
            setIsEditBlockOpen(false);
            console.log(formBlocksData);
          }}
        >
          <div>
            {isAddFormNameOpen && (
              <Form>
                <label>Add form name</label>
                <input
                  placeholder="Enter form name"
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                  }}
                ></input>
                <div className="controllers">
                  <Button
                    type="button"
                    onClick={() => {
                      submit_form_name_handler();
                    }}
                  >
                    <MdDone />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsPopUpOpen(false);
                      setIsAddFormNameOpen(false);
                      setIsSeeBlocksOpen(false);
                    }}
                  >
                    <IoIosClose />
                  </Button>
                </div>
              </Form>
            )}

            {isSeeBlocksOpen && (
              <BlocksContainer>
                {formBlocs.map((block, index) => (
                  <Block key={index}>
                    <div className="block-controlers">
                      <button>
                        <FaRegEdit
                          size={20}
                          onClick={() => {
                            setIsEditBlockOpen(true);
                            setIsAddFormNameOpen(false);
                            setIsSeeBlocksOpen(false);
                            setBlockId(block.id);
                          }}
                        />
                      </button>
                      <button>
                        <HiOutlineDuplicate
                          size={20}
                          onClick={() => {
                            duplicate_block_handler(block.id);
                          }}
                        />
                      </button>
                      <button>
                        <MdDeleteOutline
                          size={20}
                          onClick={() => {
                            delete_block_handler(block.id);
                          }}
                        />
                      </button>
                    </div>
                  </Block>
                ))}
                <AddNewBlock onCreateNewBlock={create_new_block_handler} />
              </BlocksContainer>
            )}

            {isEditBlockOpen && (
              <EditBlock
                onSeeBlocksOpen={() => {
                  setIsSeeBlocksOpen(true);
                  setIsPopUpOpen(true);
                  setIsEditBlockOpen(false);
                  setIsAddFormNameOpen(false);
                }}
                isBlocksOpen={isSeeBlocksOpen}
                id={blockId}
              />
            )}

            {isSeeAllBlocksInpusOpen && (
              <div className="form_type">
                {formBlocksData.map((block, blockIndex) => {
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
                            {/* {formErrors[index] && (
                          <p className="error-message">{formErrors[index]}</p>
                        )} */}
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
                      add_min_max_value_handler(question.id);
                      console.log(question);
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
                      updateMinMaxValuesHandler(question.id);
                      console.log(question);
                    }}
                  >
                    <MdDone />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {isSeeAllBlocksInpusOpen && (
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
                        setIsAddSubQuestionFormNameOpen(false);
                        setIsSeeAllSubQuestionBlocksOpen(false);
                      }}
                    >
                      <IoIosClose />
                    </Button>
                  </div>
                </Form>
              )}

              {isSeeSubQuestionFormBlocksOpen && (
                <BlocksContainer>
                  {subQuestionFormBlocks.map((block, index) => (
                    <Block key={index}>
                      <div className="block-controlers">
                        <button>
                          <FaRegEdit
                            size={20}
                            onClick={() => {
                              setIsEditSubQuestionBlocksOpen(true);
                              setIsAddSubQuestionFormNameOpen(false);
                              setIsSeeAllSubQuestionBlocksOpen(false);
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
                  ))}
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
                        <IoIosClose
                          className="form_type_controllers"
                          size={20}
                        />

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
            </div>
          )}
        </PopUpContentContainer>
      </PopUp>
      <Reorder.Item value={question} key={question.id}>
        <div>
          <Table.Row id={`menus-row--${question.id}`}>
            <div>
              {question?.subQuestions?.length > 0 ? (
                <button
                  style={{ background: "none", border: "none" }}
                  // here were i activate and desactivate the toggle
                  onClick={() => setcaret((caret) => !caret)}
                >
                  {!caret_icon_active ? <RxCaretDown /> : <RxCaretUp />}
                </button>
              ) : null}
            </div>
            <div className="hideOverflow questions">
              {question.questionText}
            </div>
            <div className="hideOverflow questions">{question.description}</div>

            {/* <Menus.Toggle id={String(question.id)} /> */}
            {/* <Menus.List id={String(question.id)}>
              {question.valueType.startsWith("checkbox") && (
                <Menus.Button
                  icon={<HiEye />}
                  onClick={() => navigate(`${question.id}`)}
                >
                  See Choices
                </Menus.Button>
              )}

              {question.valueType.startsWith("form") &&
                (formBlocs.length === 0 ? (
                  <Menus.Button
                    icon={<HiEye />}
                    onClick={() => {
                      setIsPopUpOpen(true);
                      setIsAddFormNameOpen(true);
                      console.log(question.id);
                    }}
                  >
                    Add form
                  </Menus.Button>
                ) : (
                  <Menus.Button
                    icon={<HiEye />}
                    onClick={() => {
                      setIsPopUpOpen(true);
                      setIsSeeBlocksOpen(true);
                      localStorage.setItem("isSeeBlockOpen", "true");
                    }}
                  >
                    See Blocs
                  </Menus.Button>
                ))}
              <Menus.Button
                icon={<HiEye />}
                onClick={() => navigate(`addSubQuestion/${question.id}`)}
              >
                Add SubQuestions
              </Menus.Button>
              <Menus.Button
                icon={<HiPencil />}
                onClick={() => navigate(`editQuestion/${question.id}`)}
              >
                Edit
              </Menus.Button>

              <Modal.Open opens={`delete-question-${question.id}`}>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List> */}

            {caret_icon_active === false && (
              <Menus.Toggle id={String(question.id)} />
            )}

            {caret_icon_active === false && (
              <Menus.List id={String(question.id)}>
                {question.valueType.startsWith("checkbox") && (
                  <Menus.Button
                    icon={<HiEye />}
                    onClick={() => navigate(`${question.id}`)}
                  >
                    See Choices
                  </Menus.Button>
                )}

                {question.valueType.startsWith("form") &&
                  (formBlocs.length === 0 ? (
                    <Menus.Button
                      icon={<HiEye />}
                      onClick={() => {
                        setIsPopUpOpen(true);
                        setIsAddFormNameOpen(true);
                        console.log(question.id);
                      }}
                    >
                      Add form
                    </Menus.Button>
                  ) : (
                    <Menus.Button
                      icon={<HiEye />}
                      onClick={() => {
                        setIsPopUpOpen(true);
                        setIsSeeBlocksOpen(true);
                        localStorage.setItem("isSeeBlockOpen", "true");
                      }}
                    >
                      See Blocs
                    </Menus.Button>
                  ))}

                {question.valueType.startsWith("filter") &&
                !isFilterHaveValue ? (
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
                )}

                <Menus.Button
                  icon={<HiEye />}
                  onClick={() => navigate(`addSubQuestion/${question.id}`)}
                >
                  Add SubQuestions
                </Menus.Button>
                <Menus.Button
                  icon={<HiPencil />}
                  onClick={() => navigate(`editQuestion/${question.id}`)}
                >
                  Edit
                </Menus.Button>

                <Modal.Open opens={`delete-question-${question.id}`}>
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>
            )}

            <Modal.Window name={`delete-question-${question.id}`}>
              <ConfirmDeleteQuestion questionId={question.id} />
            </Modal.Window>
          </Table.Row>
        </div>

        {caret_icon_active ? (
          <Reorder.Group onReorder={handleReorder} values={squestionOrderTest}>
            {squestionOrderTest?.map((sq, i) => {
              return (
                <Reorder.Item value={sq} key={sq.id}>
                  <Table.Row id={`menus-row--sq--${sq.id}`} mainId={sq.id}>
                    <div></div>
                    <div
                      className="hideOverflow questionColor"
                      style={{ marginLeft: "35px", color: "#646464" }}
                    >
                      {sq.questionText}
                    </div>
                    <div
                      className="hideOverflow questionColor"
                      style={{ marginLeft: "35px", color: "#646464" }}
                    >
                      {sq.Description}
                    </div>
                    <Menus.Toggle id={String(sq.id)} />
                    {/* this is the button who open the subList*/}
                    <Menus.ListSub id={String(sq.id)}>
                      <Menus.Button
                        icon={<HiPencil />}
                        onClick={() => {
                          navigate(`editSubQuestion/${question.id}/${sq.id}`);
                        }}
                      >
                        Edit SubQuestion
                      </Menus.Button>

                      {sq.valueType === "form" &&
                        (subQuestionFormBlocks.length === 0 ? (
                          <Menus.Button
                            icon={<HiPencil />}
                            onClick={() => {
                              setIsPopUpOpen(true);
                              setIsSeeSubQuestionBlocks(true);
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
                      <Modal.Open
                        opens={`delete-subquestion-${sq.id}-${question.id}`}
                      >
                        <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                      </Modal.Open>
                    </Menus.ListSub>

                    {/* {this is the window to confirm the delete} */}
                    <Modal.Window
                      name={`delete-subquestion-${sq.id}-${question.id}`}
                    >
                      <ConfirmDeleteSubQuestion
                        questionParentId={Number(question.id)}
                        questionId={Number(sq.id)}
                      />
                    </Modal.Window>
                  </Table.Row>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <div></div>
        )}
      </Reorder.Item>
    </>
  );
};

export default QuestionsRow;
