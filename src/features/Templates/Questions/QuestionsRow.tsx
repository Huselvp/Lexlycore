import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import Menus from "../../../ui/Menus";
import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteQuestion from "./ConfirmDeleteQuestion";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Reorder } from "framer-motion";

import axios from "axios";
import { API, getApiConfig } from "../../../utils/constants";

import SubQuestionRow from "../../../pages/admin/components/SubQuestionRow/SubQuestionRow";

import PopUp from "../../../pages/admin/components/popUp/PopUp";

import PopUpContentContainer from "../../../pages/admin/components/popup_content_container/PopUpContantContainer";
import Form from "../../../pages/admin/components/UI/form/Form";
import Button from "../../../pages/admin/components/UI/btns/Button";
import AddNewBlock from "../../../pages/admin/components/addNewBlock/AddNewBlock";
import BlocksContainer from "../../../pages/admin/components/blocksContainer/BlocksContainer";
import EditBlock from "../../../pages/admin/components/editBlock/editBlock";

import { FiUser } from "react-icons/fi";

import { BsBuildings } from "react-icons/bs";

import { IoIosClose } from "react-icons/io";
import { HiOutlineDuplicate } from "react-icons/hi";

import { FaRegEdit } from "react-icons/fa";

import { MdDeleteOutline } from "react-icons/md";

import { MdDone } from "react-icons/md";

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

  const [isAddBlockTypeOpen, setIsAddBlockTypeOpen] = useState(false);

  const [blockId, setBlockId] = useState(0);

  const [caret_icon_active, setcaret] = useState(false);

  const navigate = useNavigate();

  const [blockType, setBlockType] = useState("");

  const [formBlocs, setFormBlocs] = useState([]);

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const [blockPositions, setBlockPositions] = useState([]);

  const [isUpdateMaxMinValuesOpen, setIsUpdatedMaxMinValuesOpen] =
    useState(false);
  const [updatedMinValue, setUpdatedMinValue] = useState(0);
  const [updatedMaxValue, setUpdatedMaxValue] = useState(0);

  const openBlockTypeHandler = () => {
    setIsAddBlockTypeOpen(true);
    setIsSeeBlocksOpen(false);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setBlockType(value);
    } else {
      setBlockType("");
    }
  };

  const [squestionOrderTest, setSQuestionOrderTest] = useState(
    question?.subQuestions.sort((a, b) => a.position - b.position)
  );
  const squestionIds = squestionOrderTest.map((q) => q?.id);

  const handleReorder = (newOrder) => {
    setSQuestionOrderTest(newOrder);
  };

  const [formBlocksData, setFormBblocksData] = useState([]);

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

  const get_form_blocks_handler = useCallback(async (id) => {
    try {
      const result = await axios.get(
        `${API}/form/blocks/${id}`,
        getApiConfig()
      );
      const blocks = result?.data;
      setFormBlocs(blocks);
      setIsTherBlocks(blocks.length > 0);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const get_formId = useCallback(
    async (id) => {
      try {
        const result = await axios.get(
          `${API}/form/get-by-question-id/${id}`,
          getApiConfig()
        );
        const formId = result?.data;
        if (typeof formId === "number") {
          setFormBlocksId(formId);
          await get_form_blocks_handler(formId);
        } else {
          setFormBlocksId("");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [get_form_blocks_handler, API, getApiConfig]
  );

  useEffect(() => {
    if (question?.id) {
      get_formId(question.id);
    }
  }, [get_formId, question.id]);

  const submit_form_name_handler = async () => {
    if (!formTitle) {
      console.log("form title should not be empty");
      return;
    }
    try {
      const result = await axios.post(
        `${API}/form/create/${question.id}`,
        { title: formTitle },
        getApiConfig()
      );
      setIsAddFormNameOpen(false);
      setIsSeeBlocksOpen(true);
      get_form_blocks_handler(result?.data.question.id);
      setFormBlocksId(result?.data.id);
    } catch (err) {
      console.error(err);
    }
  };

  const create_new_block_handler = async () => {
    try {
      const result = await axios.post(
        `${API}/form/block/${formBlocksId}`,
        { type: blockType === "null" ? null : blockType },
        getApiConfig()
      );
      get_form_blocks_handler(formBlocksId);
      setIsAddBlockTypeOpen(false);
      setIsSeeBlocksOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const delete_block_handler = useCallback(
    async (id) => {
      try {
        await axios.delete(
          `${API}/form/block/${formBlocksId}/${id}`,
          getApiConfig()
        );
        get_form_blocks_handler(formBlocksId);
      } catch (err) {
        console.error(err);
      }
    },
    [formBlocksId, get_form_blocks_handler, API, getApiConfig]
  );

  const duplicate_block_handler = useCallback(
    async (id) => {
      try {
        await axios.post(
          `${API}/form/block/duplicate/${formBlocksId}/${id}`,
          {},
          getApiConfig()
        );
        get_form_blocks_handler(formBlocksId);
      } catch (err) {
        console.error(err);
      }
    },
    [formBlocksId, get_form_blocks_handler, API, getApiConfig]
  );

  const get_form_blocks = async (id) => {
    try {
      const result = await axios.get(
        `${API}/suser/question-details/${id}`,
        getApiConfig()
      );
      setFormBblocksData(result?.data.form.blocks);
      console.log(result?.data.form.blocks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    get_form_blocks(question.id);
  }, [question.id]);

  // ++++++++++++++++++++

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
            setFilterData(result?.data);
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

  // ====================

  const DraggableItem = ({ item, index, moveItem, children }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
      accept: "BLOCK",
      hover: (draggedItem) => {
        if (!ref.current) return;
        const dragIndex = draggedItem.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;

        moveItem(dragIndex, hoverIndex);
        draggedItem.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: "BLOCK",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className={`item ${isDragging ? "dragging" : ""}`} key={item.id}>
          <h1>Block</h1>
          {children}
        </div>
      </div>
    );
  };

  useEffect(() => {
    setBlockPositions(formBlocs?.map((bloc) => bloc.id));
  }, [formBlocs]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...formBlocs];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    setFormBlocs(updatedItems); // Update the state with the new order of items

    // Update block positions to match the new order
    const updatedBlockPositions = updatedItems.map((item) => item.id);
    setBlockPositions(updatedBlockPositions);

    // Submit the new block positions
    submitBlockPositions(updatedBlockPositions);
  };

  const submitBlockPositions = async (positions) => {
    try {
      await axios.put(`${API}/form/blocks/reorder`, positions, getApiConfig());
      console.log("Block positions submitted successfully");
    } catch (error) {
      console.error("Error submitting block positions:", error);
    }
  };

  // ============

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  // ======

  const [countriesList, setCountriesList] = useState([]);

  const getCountriesList = async () => {
    try {
      const result = await axios.get(
        "http://api.geonames.org/countryInfoJSON?username=anasiker&lang=da"
      );
      const sortedCountries = result.data.geonames.sort((a, b) => {
        if (a.countryName < b.countryName) return -1;
        if (a.countryName > b.countryName) return 1;
        return 0;
      });
      setCountriesList(sortedCountries);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCountriesList();
  }, []);

  // ============

  // const RecursiveSubQuestionRow = ({
  //   subQuestion,
  //   questionId,
  //   isNested = false,
  //   depth = -1,
  // }) => {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const toggleOpen = () => {
  //     setIsOpen((prev) => !prev);
  //   };

  //   const newDepth = depth + 1;

  //   return (
  //     <Reorder.Item value={subQuestion} key={subQuestion.id}>
  //       <SubQuestionRow
  //         id={subQuestion.id}
  //         subQuestion={subQuestion}
  //         questionId={questionId}
  //         isOpen={isOpen}
  //         toggleOpen={toggleOpen}
  //         isNested={isNested}
  //         depth={newDepth}
  //       />

  //       {isOpen &&
  //         subQuestion.subQuestions &&
  //         subQuestion.subQuestions.length > 0 && (
  //           <Reorder.Group
  //             onReorder={() => {
  //               console.log(100);
  //             }}
  //             values={subQuestion.subQuestions}
  //           >
  //             {subQuestion.subQuestions.map((sq) => (
  //               <RecursiveSubQuestionRow
  //                 key={sq.id}
  //                 subQuestion={sq}
  //                 questionId={subQuestion.id}
  //                 isNested={true}
  //                 depth={newDepth}
  //               />
  //             ))}
  //           </Reorder.Group>
  //         )}
  //     </Reorder.Item>
  //   );
  // };

  // Helper function to collect all subquestion IDs
  // const collectSubQuestionIds = (subQuestion) => {
  //   let ids = [subQuestion.id];

  //   if (subQuestion.subQuestions) {
  //     for (const sq of subQuestion.subQuestions) {
  //       ids = ids.concat(collectSubQuestionIds(sq));
  //     }
  //   }

  //   return ids;
  // };

  // const RecursiveSubQuestionRow = ({
  //   question,
  //   subQuestion,
  //   questionId,
  //   isNested = false,
  //   depth = -1,
  // }) => {
  //   const [isOpen, setIsOpen] = useState(false);
  //   const [newPlace, setNewPlace] = useState(subQuestion);

  //   const toggleOpen = () => {
  //     setIsOpen((prev) => !prev);
  //   };

  //   const newDepth = depth + 1;

  //   const handleReorder = (newOrder) => {
  //     console.log("New order:", newOrder);

  //     // Assuming newOrder is an array of reordered subQuestions
  //     const updatedSubQuestions = newOrder.map((item) => ({
  //       ...item,
  //       subQuestions: item.subQuestions
  //         ? item.subQuestions.map((sub) => ({ ...sub }))
  //         : [],
  //     }));

  //     setNewPlace((prev) => ({
  //       ...prev,
  //       subQuestions: updatedSubQuestions,
  //     }));

  //     const collectedIds = collectSubQuestionIds(question.subQuestions);
  //     console.log("Collected IDs:", collectedIds);
  //     console.log(question, "9999999999999999999999999999");
  //   };

  //   return (
  //     <Reorder.Item value={newPlace} key={newPlace.id}>
  //       <SubQuestionRow
  //         id={newPlace.id}
  //         subQuestion={newPlace}
  //         questionId={questionId}
  //         isOpen={isOpen}
  //         toggleOpen={toggleOpen}
  //         isNested={isNested}
  //         depth={newDepth}
  //       />

  //       {isOpen &&
  //         newPlace.subQuestions &&
  //         newPlace.subQuestions.length > 0 && (
  //           <Reorder.Group
  //             onReorder={handleReorder}
  //             values={newPlace.subQuestions}
  //           >
  //             {newPlace.subQuestions?.map((sq) => (
  //               <RecursiveSubQuestionRow
  //                 key={sq.id}
  //                 subQuestion={sq}
  //                 questionId={newPlace.id}
  //                 isNested={true}
  //                 depth={newDepth}
  //               />
  //             ))}
  //           </Reorder.Group>
  //         )}
  //     </Reorder.Item>
  //   );
  // };

  // Function to collect all subquestion and nested subquestion IDs
  const collectSubQuestionIds = (subQuestion) => {
    let ids = [subQuestion.id];

    if (subQuestion.subQuestions && subQuestion.subQuestions.length > 0) {
      for (const sq of subQuestion.subQuestions) {
        ids = ids.concat(collectSubQuestionIds(sq));
      }
    }

    return ids;
  };

  const RecursiveSubQuestionRow = React.memo(
    ({ question, subQuestion, questionId, isNested = false, depth = -1 }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [newPlace, setNewPlace] = useState(subQuestion);

      const toggleOpen = () => {
        setIsOpen((prev) => !prev);
      };

      const newDepth = depth + 1;

      // Handle reorder and collect IDs of subquestions
      const handleReorder = (newOrder) => {
        console.log("New order:", newOrder);

        // Update the subQuestions structure after reorder
        const updatedSubQuestions = newOrder.map((item) => ({
          ...item,
          subQuestions: item.subQuestions
            ? item.subQuestions.map((sub) => ({ ...sub }))
            : [],
        }));

        // Update state with the new subQuestions structure
        setNewPlace((prev) => ({
          ...prev,
          subQuestions: updatedSubQuestions,
        }));

        // Collect all IDs for subquestions of the question
        const collectedIds = question.subQuestions
          ? question.subQuestions.flatMap(collectSubQuestionIds)
          : [];

        console.log("Collected IDs:", collectedIds);
        console.log(question, "9999999999999999999999999999");

        // Extract the IDs from the new order
        const newOrderIds = newOrder.map((item) => item.id);

        // Function to reorder the subquestions based on their IDs
        const reorderQuestions = async (squestionids) => {
          try {
            await axios
              .put(
                `${API}/admin/questions/subquestions/reorder/${question.id}`,
                squestionids,
                getApiConfig()
              )
              .then((result) => {
                console.log(result.data);
              });
          } catch (error) {
            console.error("Error reordering questions:", error);
          }
        };

        // Call reorderQuestions with the array of reordered subquestion IDs
        reorderQuestions(newOrderIds);
      };

      return (
        <Reorder.Item value={newPlace} key={newPlace.id}>
          <SubQuestionRow
            id={newPlace.id}
            subQuestion={newPlace}
            questionId={questionId}
            isOpen={isOpen}
            toggleOpen={toggleOpen}
            isNested={isNested}
            depth={newDepth}
          />

          {isOpen &&
            newPlace.subQuestions &&
            newPlace.subQuestions.length > 0 && (
              <Reorder.Group
                onReorder={handleReorder}
                values={newPlace.subQuestions}
              >
                {newPlace.subQuestions?.map((sq) => (
                  <RecursiveSubQuestionRow
                    key={sq.id}
                    subQuestion={sq}
                    questionId={newPlace.id}
                    isNested={true}
                    depth={newDepth}
                    question={question}
                  />
                ))}
              </Reorder.Group>
            )}
        </Reorder.Item>
      );
    }
  );

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
            get_form_blocks(question.id);
          }}
          isBlocksOpen={isSeeBlocksOpen}
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
                <div className="see_blocs_controller add-new-input">
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
                <DndProvider backend={HTML5Backend}>
                  {formBlocs?.map((item, index) => (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      index={index}
                      moveItem={moveItem}
                    >
                      <div className="item-controlers">
                        {item.type !== "COMPANY" && item.type !== "PERSON" && (
                          <button
                            onClick={() => {
                              setIsEditBlockOpen(true);
                              setIsAddFormNameOpen(false);
                              setIsSeeBlocksOpen(false);
                              setBlockId(item.id);
                            }}
                          >
                            <FaRegEdit size={20} />
                          </button>
                        )}
                        <button>
                          <HiOutlineDuplicate
                            size={20}
                            onClick={() => {
                              duplicate_block_handler(item.id);
                            }}
                          />
                        </button>
                        <button>
                          <MdDeleteOutline
                            size={20}
                            onClick={() => {
                              delete_block_handler(item.id);
                            }}
                          />
                        </button>
                      </div>
                    </DraggableItem>
                  ))}
                  <style jsx>{`
                    .item {
                      background-color: #fffdf0;
                      border-radius: 10px;
                      border: 1px solid #9e977e;
                      height: 25rem;
                      width: 25rem;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      gap: 0.5rem;
                      padding: 2rem;
                      z-index: 100;
                      cursor: pointer;
                      position: relative;
                      transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }

                    .item-controlers {
                      position: absolute;
                      top: 1rem;
                      right: 1rem;
                    }

                    .item h1 {
                      color: #ebe5d0;
                    }

                    .item button {
                      color: black;
                      background-color: transparent;
                      z-index: 200;
                    }

                    .item.dragging {
                      opacity: 0.5;
                      transform: scale(0.9);
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }
                  `}</style>
                </DndProvider>
                <AddNewBlock openBlockType={openBlockTypeHandler} />
              </BlocksContainer>
            )}

            {isAddBlockTypeOpen && (
              <div className="block-type">
                <form>
                  <div
                    className="type"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      width: "100%",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="normal"
                      name="Normal"
                      value="null"
                      onChange={handleCheckboxChange}
                      checked={blockType === "null"}
                      style={{
                        width: "fit-content",
                        accentColor: "#9a9278",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    />
                    <label htmlFor="normal" style={{ cursor: "pointer" }}>
                      Normal
                    </label>
                  </div>

                  <div
                    className="type"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      width: "100%",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="persone"
                      name="persone"
                      value="PERSON"
                      onChange={handleCheckboxChange}
                      checked={blockType === "PERSON"}
                      style={{
                        width: "fit-content",
                        accentColor: "#9a9278",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    />
                    <label htmlFor="persone" style={{ cursor: "pointer" }}>
                      Persone
                    </label>
                  </div>

                  <div
                    className="type"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      width: "100%",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="company"
                      name="company"
                      value="COMPANY"
                      onChange={handleCheckboxChange}
                      checked={blockType === "COMPANY"}
                      style={{
                        width: "fit-content",
                        accentColor: "#9a9278",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    />
                    <label htmlFor="company" style={{ cursor: "pointer" }}>
                      Company
                    </label>
                  </div>
                </form>

                <div
                  className="see_blocs_controller add-new-input"
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    gap: "2rem",
                  }}
                >
                  <Button
                    type="button"
                    onClick={() => {
                      create_new_block_handler();
                    }}
                  >
                    <MdDone />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddBlockTypeOpen(false);
                      setIsSeeBlocksOpen(true);
                    }}
                  >
                    <IoIosClose />
                  </Button>
                </div>
              </div>
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
                {formBlocksData?.map((block, blockIndex) => {
                  if (block.type === "COMPANY") {
                    return (
                      <div
                        className="company"
                        style={{
                          backgroundColor: "rgb(255, 255, 255)",
                          padding: "2rem",
                          borderRadius: "10px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "2rem",
                          }}
                        >
                          <div
                            style={{
                              width: "5rem",
                              height: "5rem",
                              backgroundColor: "#9a9278",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50px",
                            }}
                          >
                            <span>
                              <BsBuildings color="white" />
                            </span>
                          </div>
                          <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                            Virksomhed
                          </p>
                        </div>

                        <div>
                          <form>
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                gap: "2rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="Virksomhedsnavn"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Virksomhedsnavn
                                </label>
                                <input
                                  id="Virksomhedsnavn"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="adresse"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Adresse
                                </label>
                                <input
                                  id="adresse"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                gap: "2rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="cpr"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  CVR nr
                                </label>
                                <input
                                  id="cpr"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "40%",
                                }}
                              >
                                <label
                                  htmlFor="postnr"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Postnr
                                </label>
                                <input
                                  id="postnr"
                                  type="number"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "55%",
                                }}
                              >
                                <label
                                  htmlFor="by"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  By
                                </label>
                                <input
                                  id="by"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                gap: "2rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="name"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Herefter otalt som
                                </label>

                                <input
                                  id="nmae"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="adresse"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Land
                                </label>
                                <select
                                  name="land"
                                  id="land"
                                  style={{
                                    width: "100%",
                                    padding: "0.8rem 1.2rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: " 4px",
                                    backgroundColor: " #fff",
                                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                    paddingRight: "30px",
                                  }}
                                >
                                  {countriesList.map((country) => {
                                    return (
                                      <option value={country.countryName}>
                                        {country.countryName}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    );
                  } else if (block.type === "PERSON") {
                    return (
                      <div
                        className="person"
                        style={{
                          backgroundColor: "rgb(255, 255, 255)",
                          padding: "2rem",
                          borderRadius: "10px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "2rem",
                          }}
                        >
                          <div
                            style={{
                              width: "5rem",
                              height: "5rem",
                              backgroundColor: "#9a9278",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50px",
                            }}
                          >
                            <span>
                              <FiUser color="white" />
                            </span>
                          </div>
                          <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                            Person
                          </p>
                        </div>

                        <div>
                          <form>
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                gap: "2rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="name"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Navn
                                </label>
                                <input
                                  id="nmae"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="adresse"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Adresse
                                </label>
                                <input
                                  id="adresse"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                gap: "2rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="cpr"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  CPR nr
                                </label>
                                <input
                                  id="cpr"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "40%",
                                }}
                              >
                                <label
                                  htmlFor="postnr"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Postnr
                                </label>
                                <input
                                  id="postnr"
                                  type="number"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "55%",
                                }}
                              >
                                <label
                                  htmlFor="by"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  By
                                </label>
                                <input
                                  id="by"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                gap: "2rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="name"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Herefter otalt som
                                </label>

                                <input
                                  id="nmae"
                                  type="text"
                                  style={{ width: "100%" }}
                                ></input>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  width: "100%",
                                }}
                              >
                                <label
                                  htmlFor="adresse"
                                  style={{
                                    marginBottom: "1rem",
                                    fontWeight: "700",
                                  }}
                                >
                                  Land
                                </label>
                                <select
                                  name="land"
                                  id="land"
                                  style={{
                                    width: "100%",
                                    padding: "0.8rem 1.2rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: " 4px",
                                    backgroundColor: " #fff",
                                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                    paddingRight: "30px",
                                  }}
                                >
                                  {countriesList.map((country) => {
                                    return (
                                      <option value={country.countryName}>
                                        {country.countryName}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    );
                  }

                  // Check if the block has data (e.g., labels) before rendering
                  if (!block.labels || block.labels.length === 0) {
                    return null;
                  }

                  return (
                    <div className="form-block-user" key={block.id}>
                      {/* <IoIosClose className="form_type_controllers" size={20} /> */}
                      {block.labels?.map((label, labelIndex) => {
                        // Check if the label name is empty before rendering
                        if (!label.name) {
                          return null;
                        }
                        return (
                          <div key={label.id} className="block-input">
                            <label>{label.name}</label>
                            {label.type === "SELECT" ? (
                              <select name={label.name}>
                                <option value="">Select an option</option>
                                {Object.keys(label.options)?.map((key) => (
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

                <div
                  className="see_blocs_controller add-new-input"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsSeeBlocksOpen(true);
                      setIsSeeAllBlocksInputOpen(false);
                    }}
                  >
                    Back
                  </button>
                </div>
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

                {/* <div className="controllers">
                  <button
                    type="button"
                    onClick={() => {
                      add_min_max_value_handler(question.id);
                    }}
                  >
                    <MdDone />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // setIsSeeBlocksOpen(true);
                      // setIsSeeAllBlocksInputOpen(false);
                    }}
                  >
                    Back
                  </button>
                </div> */}

                <div
                  className="see_blocs_controller add-new-input"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      add_min_max_value_handler(question.id);
                    }}
                  >
                    <MdDone />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopUpOpen(false);
                      setIsAddMaxMinValuesOpen(false);
                    }}
                  >
                    Back
                  </button>
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

                {/* <div className="controllers">
                  <Button
                    type="button"
                    onClick={() => {
                      updateMinMaxValuesHandler(question.id);
                      console.log(question);
                    }}
                  >
                    <MdDone />
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      // setIsSeeBlocksOpen(true);
                      // setIsSeeAllBlocksInputOpen(false);
                    }}
                  >
                    Back
                  </button>
                </div> */}

                <div
                  className="see_blocs_controller add-new-input"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      updateMinMaxValuesHandler(question.id);
                    }}
                  >
                    <MdDone />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopUpOpen(false);
                      setIsUpdatedMaxMinValuesOpen(false);
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
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
                  onClick={() => {
                    setcaret((prevCaret) => !prevCaret);
                    setIsSubMenuOpen(true);
                  }}
                >
                  {!caret_icon_active ? <RxCaretDown /> : <RxCaretUp />}
                </button>
              ) : null}
            </div>

            <div className="hideOverflow questions">
              {question.questionText}
            </div>
            <div className="hideOverflow questions">{question.description}</div>

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
                  (formBlocksId === "" ? (
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
                        setIsSeeAllBlocksInputOpen(false);
                        localStorage.setItem("isSeeBlockOpen", "true");
                      }}
                    >
                      See Blocs
                    </Menus.Button>
                  ))}

                {question.valueType.startsWith("filter") &&
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

        {/* {caret_icon_active ? (
          <Reorder.Group onReorder={handleReorder} values={squestionOrderTest}>
            {squestionOrderTest?.map((sq, i) => {
              return (
                <Reorder.Item value={sq} key={sq.id}>
                  <SubQuestionRow subQuestion={sq} questionId={question.id} />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <div></div>
        )} */}

        {caret_icon_active ? (
          <Reorder.Group onReorder={handleReorder} values={squestionOrderTest}>
            {squestionOrderTest?.map((sq) => (
              <RecursiveSubQuestionRow
                question={question}
                key={sq.id}
                subQuestion={sq}
                questionId={question.id}
              />
            ))}
          </Reorder.Group>
        ) : (
          <div></div>
        )}
      </Reorder.Item>
    </>
  );
};

export default QuestionsRow;
