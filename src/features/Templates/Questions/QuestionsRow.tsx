import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
// import { FaCaretDown, FaCaretUp  } from "react-icons/fa";
import Menus from "../../../ui/Menus";
import Table from "../../../ui/Table";
import Modal from "../../../ui/Modal";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDeleteQuestion from "./ConfirmDeleteQuestion";
import { useEffect, useRef, useState } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import ConfirmDeleteSubQuestion from "./ConfirmDeleteSubQuestion";
import { Reorder, color } from "framer-motion";
import { useTemplate } from "../useTemplate";
import axios from "axios";
import { API, getApiConfig } from "../../../utils/constants";

const QuestionsRow = ({ question }: { question: Question }) => {
  const [caret_icon_active, setcaret] = useState(false);

  const navigate = useNavigate();

  const { templateId } = useParams<{ templateId: string }>();

  const [formBlocs, setFormBlocs] = useState([]);

  const [squestionOrderTest, setSQuestionOrderTest] = useState(
    question?.subQuestions.sort((a, b) => a.position - b.position)
  );
  const squestionIds = squestionOrderTest.map((q) => q?.id);
  console.log("subquestions ids before : ", squestionIds);

  const handleReorder = (newOrder) => {
    setSQuestionOrderTest(newOrder);
    console.log("subquestions new order ids test function", newOrder);
  };

  useEffect(() => {
    const reorderQuestions = async (squestionids: number[]) => {
      try {
        const response = await axios.put(
          `${API}/admin/questions/subquestions/reorder/${question.id}`,
          squestionids,
          getApiConfig()
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error reordering questions:", error);
      }
    };

    reorderQuestions(squestionIds);
  }, [squestionOrderTest]);

  useEffect(() => {
    setSQuestionOrderTest(question?.subQuestions);
  }, [question?.subQuestions]);

  // const getBlocInputs = await axios.get(
  //   `http://localhost:8081/api/form/block/label/${templateId}`,
  //   getApiConfig()
  // );

  // useEffect(() => {
  //   const getFormBlocs = async () => {
  //     try {
  //       const getBlocInputs = await axios.get(
  //         `http://localhost:8081/api/form/blocks/${question.id}`,
  //         getApiConfig()
  //       );

  //       setFormBlocs(getBlocInputs.data);

  //       console.log(formBlocs, "this is the form blocs");
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   getFormBlocs();
  // }, [question.id]);

  useEffect(() => {
    const getFormBlocs = async () => {
      try {
        await axios
          .get(
            `http://localhost:8081/api/form/blocks/${question.id}`,
            getApiConfig()
          )
          .then((result) => {
            setFormBlocs(result.data);
          });

        console.log(formBlocs, "this is the form blocs");
      } catch (err) {
        console.log(err);
      }
    };

    getFormBlocs();
  }, [question.id]);

  return (
    <>
      <Reorder.Item value={question} key={question.id}>
        <div>
          <Table.Row id={`menus-row--${question.id}`}>
            <div>
              {question?.subQuestions?.length > 0 ? (
                <button
                  style={{ background: "none", border: "none" }}
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

            <Menus.Toggle id={String(question.id)} />
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
                    onClick={() => navigate(`addNewForm/${question.id}`)}
                  >
                    Add form
                  </Menus.Button>
                ) : (
                  <Menus.Button
                    icon={<HiEye />}
                    onClick={() => navigate(`seeBlocks/${question.id}`)}
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
            </Menus.List>

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
                  <Table.Row id={`menus-row--sq--${sq.id}`}>
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
                    <Menus.ListSub id={String(sq.id)}>
                      <Menus.Button
                        icon={<HiPencil />}
                        onClick={() =>
                          navigate(`editSubQuestion/${question.id}/${sq.id}`)
                        }
                      >
                        Edit SubQuestion
                      </Menus.Button>
                      <Modal.Open
                        opens={`delete-subquestion-${sq.id}-${question.id}`}
                      >
                        <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                      </Modal.Open>
                    </Menus.ListSub>
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
