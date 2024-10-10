import React, { useState, useEffect, useRef } from "react";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PopUp from "../../../admin/components/popUp/PopUp";
import PopUpContentContainer from "../../../admin/components/popup_content_container/PopUpContantContainer";
import Form from "../../../admin/components/UI/form/Form";
import Button from "../../../admin/components/UI/btns/Button";
import AddNewBlock from "../../../admin/components/addNewBlock/AddNewBlock";
import BlocksContainer from "../../../admin/components/blocksContainer/BlocksContainer";
import EditBlock from "../../../admin/components/editBlock/editBlock";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

import { FiUser } from "react-icons/fi";

import { BsBuildings } from "react-icons/bs";

function NestedSubQuestionRow({
  subQuestion,
  questionId,
  isOpen,
  toggleOpen,
  isNested,
  depth,
}) {
  const navigate = useNavigate();

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [isAddSubQuestionFormNameOpen, setIsAddSubQuestionFormNameOpen] =
    useState(false);

  const [isSeeSubQuestionFormBlocksOpen, setIsSeeSubQuestionBlocks] =
    useState(false);

  const [isEditSubQuestionBlocksOpen, setIsEditSubQuestionBlocksOpen] =
    useState(false);

  const [isSeeAlSubQuestionBlocksOpen, setIsSeeAllSubQuestionBlocksOpen] =
    useState(false);

  const [isSeeAllBlocksInpusOpen, setIsSeeAllBlocksInputOpen] = useState(false);

  const [isAddBlockTypeOpen, setIsAddBlockTypeOpen] = useState(false);

  const [subQuestionFormTitle, setSubQuestionFormTitle] = useState("");

  const [subQuestionFormBlocks, setSubQuestionFormBlocks] = useState([]);

  const [subQuestionFormId, setSubQuestionFormId] = useState("");

  const [subQuestionBlockId, setSubQuestionBlockId] = useState("");

  const [formBlocksData, setFormBblocksData] = useState([]);

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
            setSubQuestionFormId(result?.data.id);
          });
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
            setSubQuestionFormId(`${result?.data}`);
            getSubQuestionFormBlocksHandler(result?.data);
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
            setSubQuestionFormBlocks(result?.data);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSubQuestionFormBlocksHandler(subQuestionFormId);
  }, [subQuestionFormId]);

  const [blockType, setBlockType] = useState("");

  const create_subQuestion_new_block_handler = async () => {
    try {
      await axios
        .post(
          `${API}/form/block/${subQuestionFormId}`,
          {
            type: blockType === "null" ? null : blockType,
          },
          getApiConfig()
        )
        .then(() => {
          getSubQuestionFormBlocksHandler(subQuestionFormId);
          setIsAddBlockTypeOpen(false);
          setIsSeeSubQuestionBlocks(true);
          get_form_blocks(subQuestion.id);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const delete_subQuestion_block_handler = async (id) => {
    try {
      await axios
        .delete(`${API}/form/block/${subQuestionFormId}/${id}`, getApiConfig())
        .then(() => {
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
        .then(() => {
          getSubQuestionFormBlocksHandler(subQuestionFormId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const get_form_blocks = async (id) => {
    try {
      const result = await axios.get(
        `${API}/suser/sub-question-details/${id}`,
        getApiConfig()
      );
      setFormBblocksData(result?.data.form.blocks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    get_form_blocks(subQuestion.id);
  }, [subQuestion.id]);

  const [isAddMaxMinValuesOpen, setIsAddMaxMinValuesOpen] = useState(false);

  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

  const add_min_max_value_handler = async () => {
    if (minValue == null || (maxValue == null && minValue < maxValue)) {
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
        .then(() => {
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
            setFilterData(result?.data);
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

  const [updatedMinValue, setUpdatedMinValue] = useState<number>(0);
  const [updatedMaxValue, setUpdatedMaxValue] = useState<number>(0);

  const updateMinMaxValuesHandler = async () => {
    try {
      if (
        updatedMaxValue !== 0 &&
        updatedMinValue !== 0 &&
        updatedMaxValue > updatedMinValue
      ) {
        await axios
          .put(
            `${API}/filter/update/${
              // @ts-ignore
              filterData.id
            }`,
            {
              filterStart: `${updatedMinValue}`,
              filterEnd: `${updatedMaxValue}`,
            },
            getApiConfig()
          )
          .then(() => {
            setIsUpdatedMaxMinValuesOpen(false);
            setIsPopUpOpen(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setBlockType(value);
    } else {
      setBlockType("");
    }
  };

  const openBlockTypeHandler = () => {
    setIsAddBlockTypeOpen(true);
    setIsSeeSubQuestionBlocks(false);
  };

  // +++++++++++++++++++++++++++

  const DraggableItem = ({ item, index, moveItem, children }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
      accept: "BLOCK",
      hover: (draggedItem) => {
        if (!ref.current) return;
        // @ts-ignore
        const dragIndex = draggedItem.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;

        moveItem(dragIndex, hoverIndex);
        // @ts-ignore
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

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...subQuestionFormBlocks];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    setSubQuestionFormBlocks(updatedItems);

    const updatedBlockPositions = updatedItems.map((item) => item.id);

    submitBlockPositions(updatedBlockPositions);
  };

  const submitBlockPositions = async (positions) => {
    try {
      await axios.put(`${API}/form/blocks/reorder`, positions, getApiConfig());
    } catch (error) {
      console.error("Error submitting block positions:", error);
    }
  };

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

  const colors = [
    "#FF5733",
    "#3357FF",
    "#FF33A6",
    "#FFD133",
    "#8C33FF",
    "#33FFF5",
    "#FF8C33",
    "#33FF8C",
    "#FF3333",
    "#33FF56",
  ];

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
          onSeeAllBlocks={() => {
            setIsSeeAllBlocksInputOpen(true);
            setIsAddSubQuestionFormNameOpen(false);
            setIsSeeSubQuestionBlocks(false);
            setIsEditSubQuestionBlocksOpen(false);
            get_form_blocks(subQuestion.id);
          }}
          isBlocksOpen={isSeeSubQuestionFormBlocksOpen}
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
                <div className="see_blocs_controller add-new-input">
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
                <DndProvider backend={HTML5Backend}>
                  {subQuestionFormBlocks?.map((item, index) => (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      index={index}
                      moveItem={moveItem}
                    >
                      <div className="item-controlers">
                        {item.type !== "COMPANY" && item.type !== "PERSON" && (
                          <button>
                            <FaRegEdit
                              size={20}
                              onClick={() => {
                                setIsEditSubQuestionBlocksOpen(true);
                                setIsAddSubQuestionFormNameOpen(false);
                                setIsSeeAllSubQuestionBlocksOpen(false);
                                setIsSeeSubQuestionBlocks(false);
                                setSubQuestionBlockId(item.id);
                                get_form_blocks(subQuestion.id);
                              }}
                            />
                          </button>
                        )}
                        <button>
                          <HiOutlineDuplicate
                            size={20}
                            onClick={() => {
                              duplicate_subQuestion_block_handler(item.id);
                            }}
                          />
                        </button>
                        <button>
                          <MdDeleteOutline
                            size={20}
                            onClick={() => {
                              delete_subQuestion_block_handler(item.id);
                            }}
                          />
                        </button>
                      </div>
                    </DraggableItem>
                  ))}
                  <style
                    // @ts-ignore
                    jsx
                  >{`
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
                      display: flex;
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
                      create_subQuestion_new_block_handler();
                    }}
                  >
                    <MdDone />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddBlockTypeOpen(false);
                      setIsSeeSubQuestionBlocks(true);
                    }}
                  >
                    <IoIosClose />
                  </Button>
                </div>
              </div>
            )}

            {isSeeAllBlocksInpusOpen && (
              <div className="form_type">
                {formBlocksData?.map((block) => {
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

                  if (!block.labels || block.labels.length === 0) {
                    return null;
                  }

                  return (
                    <div className="form-block-user" key={block.id}>
                      <IoIosClose className="form_type_controllers" size={20} />
                      {block.labels?.map((label) => {
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
                      setIsSeeSubQuestionBlocks(true);
                      setIsSeeAllBlocksInputOpen(false);
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
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
                {subQuestionFormBlocks?.map((block) => {
                  return (
                    <div className="form-block-user" key={block.id}>
                      {/* <IoIosClose className="form_type_controllers" size={20} /> */}

                      {block.labels?.map((label) => {
                        return (
                          <div key={label.id} className="block-input">
                            <label>{label.name}</label>
                            {label.type === "SELECT" ? (
                              <select name={label.name}>
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
              </div>
            )}

            {isAddMaxMinValuesOpen && (
              <div>
                <form>
                  <input
                    type="number"
                    placeholder="Enter min value"
                    onChange={(e) => {
                      setMinValue(Number(e.target.value));
                    }}
                  ></input>
                  <input
                    type="number"
                    placeholder="Enter max value"
                    onChange={(e) => {
                      setMaxValue(Number(e.target.value));
                    }}
                  ></input>
                </form>

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
                      add_min_max_value_handler();
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
                      setUpdatedMinValue(Number(e.target.value));
                    }}
                  ></input>
                  <input
                    type="number"
                    placeholder="Enter max value"
                    onChange={(e) => {
                      setUpdatedMaxValue(Number(e.target.value));
                    }}
                  ></input>
                </form>

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
                      updateMinMaxValuesHandler();
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

      <Table.Row id={`menus-row--sq--${subQuestion.id}`}>
        <div className="down-icon" style={{ marginLeft: "15px" }}>
          {subQuestion?.subQuestions?.length > 0 ? (
            <button
              style={{ background: "none", border: "none" }}
              onClick={toggleOpen}
            >
              {!isOpen ? <RxCaretDown /> : <RxCaretUp />}
            </button>
          ) : null}
        </div>

        <div
          className="hideOverflow questionColor"
          style={{
            marginLeft: "20px",
            color:
              isNested && depth >= 0 && depth < colors.length
                ? colors[depth]
                : "#646464",
          }}
        >
          {subQuestion.questionText}
        </div>
        <div
          className="hideOverflow questionColor"
          style={{
            marginLeft: "35px",
            color:
              isNested && depth >= 0 && depth < colors.length
                ? colors[depth]
                : "#646464",
          }}
        >
          {subQuestion.Description}
        </div>
        <Menus.Toggle id={String(subQuestion.id)} />

        <Menus.ListSub id={String(subQuestion.id)}>
          <Menus.Button
            icon={<HiPencil />}
            onClick={() => {
              navigate(`editSubQuestion/${questionId}/${subQuestion.id}`);
            }}
          >
            Edit SubQuestion
          </Menus.Button>

          <Menus.Button
            icon={<HiPencil />}
            onClick={() => {
              navigate(`addSubSubQuestion/${subQuestion.id}`);
            }}
          >
            Add subquestion
          </Menus.Button>

          {subQuestion.valueType === "form" &&
            (subQuestionFormId === "" ? (
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
              onClick={() =>
                navigate(`subCoice/${questionId}/${subQuestion.id}`)
              }
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

export default NestedSubQuestionRow;
