import React, { useState, useEffect } from "react";

import axios from "axios";

import { getApiConfig } from "../../../../utils/constants";

import { API } from "../../../../utils/constants";

import PopUpContentContainer from "../popup_content_container/PopUpContantContainer";

import Form from "../UI/form/Form";

import Button from "../../../admin/components/UI/btns/Button";

import Block from "../../../admin/components/block/block";

import AddNewBlock from "../addNewBlock/AddNewBlock";

import BlocksContainer from "../blocksContainer/BlocksContainer";

import EditBlock from "../editBlock/editBlock";

import { IoIosClose } from "react-icons/io";

import { HiOutlineDuplicate } from "react-icons/hi";

import { FaRegEdit } from "react-icons/fa";

import { MdDeleteOutline } from "react-icons/md";

import { MdDone } from "react-icons/md";

function SubQuestionForm({ subQuestionId }) {
  const [isAddSubQuestionFormNameOpen, setIsAddSubQuestionFormNameOpen] =
    useState(false);

  const [isSeeSubQuestionFormBlocksOpen, setIsSeeSubQuestionBlocks] =
    useState(false);

  const [isEditSubQuestionBlocksOpen, setIsEditSubQuestionBlocksOpen] =
    useState(false);

  const [isSeeAlSubQuestionBlocksOpen, setIsSeeAllSubQuestionBlocksOpen] =
    useState(false);

  const [subQuestionFormTitle, setSubQuestionFormTitle] = useState("");

  const [subQuestionFormBlocks, setSubQuestionFormBlocks] = useState([]);

  const [subQuestionFormId, setSubQuestionFormId] = useState("");

  const [subQuestionBlockId, setSubQuestionBlockId] = useState("");

  const createSubQuestionFormHandler = async () => {
    try {
      if (subQuestionFormTitle !== "") {
        await axios
          .post(
            `${API}/form/create-sub/${subQuestionId}`,
            { title: subQuestionFormTitle },
            getApiConfig()
          )
          .then(() => {
            setIsAddSubQuestionFormNameOpen(false);
            setIsSeeSubQuestionBlocks(true);
            getSubQuestionFormBlocksHandler(subQuestionFormId);
          });
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
        .then(() => {
          getSubQuestionFormBlocksHandler(subQuestionFormId);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const delete_subQuestion_block_handler = async () => {
    try {
      await axios
        .delete(
          `${API}/form/block/${subQuestionFormId}/${subQuestionId}`,
          getApiConfig()
        )
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

  return (
    <React.Fragment>
      <PopUpContentContainer>
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
                        delete_subQuestion_block_handler();
                      }}
                    />
                  </button>
                </div>
              </Block>
            ))}
            <AddNewBlock
              // @ts-ignore
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
            {subQuestionFormBlocks.map((block) => {
              return (
                <div className="form-block-user" key={block.id}>
                  <IoIosClose className="form_type_controllers" size={20} />

                  {block.labels.map((label) => {
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
      </PopUpContentContainer>
    </React.Fragment>
  );
}

export default SubQuestionForm;
