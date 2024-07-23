import styled from "styled-components";
import { useTemplate } from "../../Templates/useTemplate";
import DocumentQuestion from "./DocumentQuestion";
import { useState, useEffect } from "react";
import {
  HiArrowSmRight as ArrowRightIcon,
  HiArrowSmLeft as ArrowLeftIcon,
} from "react-icons/hi";
import DocumentQuestionsOverview from "../../Documents/DocumentQuestionsOverview";
import QuestiontsSlider from "../../../ui/QuestiontsSlider";
import DocumentHeader from "../../Documents/DocumentHeader";
import DocumentSubQuestion from "./DocumentSubQuestion";

const BtnsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5rem;
  button {
    background: none;
    border: none;
    background-color: var(--color-stone-500);
    color: var(--white);
    padding: 1rem 2.5rem;
    border-radius: var(--rounded-3xl);
    font-weight: 400;
    font-size: 1.4rem;
    padding: 1rem 2rem;
    /*  */
    display: flex;
    align-items: center;
    gap: 0.5rem;
    /*  */
    &:hover {
      background-color: var(--color-stone-350);
    }
  }
  & button:last-child {
    margin-left: auto;
  }
`;
const Content = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  h2 {
    font-size: 3.2rem;
    font-weight: 600;
    margin-bottom: 0;
  }
`;
const Container = styled.div`
  padding: 2rem;
  display: grid;
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  & > div:first-child {
    /* margin-bottom: 2rem; */
  }
  & > div:last-child {
    margin-top: 3rem;
  }
`;
const DocumentQuestions = ({
  documentQuestionsValues,
}: {
  documentQuestionsValues?: DocumentQuestionsValues[];
}) => {
  const { template } = useTemplate();
  const questions = template!.questions;
  const [display, setdisplay] = useState(false);

  // this is the form data

  const [isFormDataFull, setIsFormDataFull] = useState(false);
  const [isDaysFull, setIsDaysFull] = useState(false);
  const [isTimesFull, setIsTimesFull] = useState(false);
  const [isTheSubQuestionOpen, setIsTheSubQuestionOpen] = useState(false);
  const [isAllSubQuestionDataFull, setIsAllSubQuestionDataFull] =
    useState(false);

  // this is the state where he saves the data
  const [overviewData, setOverviewData] = useState<
    {
      questionText: string;
      questionId: number;
      value: string | number;
      subQuestions?: {
        subQuestionId: number;
        subQuestionText: string;
        subQuestionValue: string | number;
      }[];
      active: boolean;
    }[]
  >(() => {
    const questionsValuesExist =
      typeof documentQuestionsValues !== "undefined" &&
      documentQuestionsValues.length > 0;

    return questions.map((q, i) => {
      const questionValues =
        documentQuestionsValues?.find((item) => item.question.id === q.id) ||
        {};
      const subQuestionsValues =
        questionsValuesExist && questionValues
          ? questionValues.subQuestions || []
          : [];
      return {
        questionText: q.questionText,
        questionId: q.id,
        value: questionsValuesExist
          ? documentQuestionsValues.find((item) => item.question.id === q.id)
              ?.value || ""
          : "",
        active: questionsValuesExist
          ? i === documentQuestionsValues.length
          : i == 0,
        subQuestions: q.subQuestions?.map((subQ) => {
          const subQuestionValue = subQuestionsValues.find(
            (sqv) => sqv.subQuestion.id === subQ.id
          );
          return {
            subQuestionId: subQ.id,
            subQuestionText: subQ.questionText,
            subQuestionValue: subQuestionValue ? subQuestionValue.value : "",
          };
        }),
        // active: i == 0
      };
    });
  });

  const isDraft = overviewData.some((q) => !q.value);
  const activeQuestion = overviewData.find((q) => q.active);

  const activeQuestionIndex = overviewData.findIndex(
    (q) => q === activeQuestion
  );
  const activeSubQuestions = questions[activeQuestionIndex]?.subQuestions || [];

  // console.log("test active subq", activeSubQuestions);
  const doesActiveQuestionHaveValue = activeQuestion?.value !== "";

  // console.log("activeQuestion = ", activeQuestion);

  const handleSetValue = (id: number, newValue: string) => {
    // here he saves the input data

    setOverviewData((current) =>
      current.map((q) => ({
        ...q,
        subQuestions: q.subQuestions?.map((subQ) =>
          subQ.subQuestionId === id
            ? { ...subQ, subQuestionValue: newValue }
            : subQ
        ),
      }))
    );
  };

  const isTherFormDataHandler = (value) => {
    setIsFormDataFull(value);
  };

  const isTherIsDays = (value) => {
    setIsDaysFull(value);
  };

  const isTherTimes = (value) => {
    setIsTimesFull(value);
  };

  const isSubOpen = (value) => {
    setIsTheSubQuestionOpen(value);
  };

  const isSubDataFull = (value) => {
    setIsAllSubQuestionDataFull(value);
  };

  return (
    <>
      <DocumentHeader isDraft={isDraft} overviewData={overviewData} />
      <Container>
        <QuestiontsSlider
          activeQuestion={overviewData.findIndex((q) => q === activeQuestion)}
          length={questions.length}
        />
        <Content>
          {activeQuestion ? (
            questions.map(
              (question, index) =>
                overviewData.at(index)?.active && (
                  <DocumentQuestion
                    key={question.id}
                    question={question}
                    value={overviewData.at(index)?.value || ""}
                    setValue={(value: string) =>
                      setOverviewData((current) =>
                        current.map((q, i) =>
                          i === index ? { ...q, value } : q
                        )
                      )
                    }
                    isTherData={(value) => {
                      isTherFormDataHandler(value);
                    }}
                    isTherDays={(value) => {
                      isTherIsDays(value);
                    }}
                    isTherTimes={(value) => {
                      isTherTimes(value);
                    }}
                  >
                    {question.subQuestions &&
                    question.subQuestions.length > 0 &&
                    display
                      ? question.subQuestions.map((sq, ind) => (
                          <DocumentSubQuestion
                            key={sq.subQuestionId}
                            question={sq}
                            data={overviewData}
                            subQuestions={question.subQuestions}
                            mainQuestionId={question.id}
                            value={
                              overviewData[index]?.subQuestions[ind]
                                ?.subQuestionValue as string | number
                            }
                            setValue={(value) => handleSetValue(sq.id, value)}
                            subOpen={(value) => {
                              isSubOpen(value);
                            }}
                            isSDataFull={(value) => {
                              isSubDataFull(value);
                            }}
                          ></DocumentSubQuestion>
                        ))
                      : null}

                    {/* { these are the controllers of the questions} */}
                    <BtnsContainer>
                      {!overviewData.at(0)?.active && (
                        <button
                          onClick={() => {
                            setOverviewData((data) =>
                              data.map((item, i) => {
                                if (i === index - 1)
                                  return { ...item, active: true };
                                else return { ...item, active: false };
                              })
                            );

                            isSubOpen(false);
                          }}
                        >
                          <ArrowLeftIcon />
                          <span>Back</span>
                        </button>
                      )}

                      {/* {question.valueType === "form" && (
                        <button
                          disabled={!isFormDataFull}
                          onClick={
                            activeSubQuestions && !display
                              ? (e) => {
                                  e.preventDefault();
                                  setdisplay(true);
                                }
                              : () => {
                                  setdisplay(false);
                                  setOverviewData((data) =>
                                    data.map((item, i) => {
                                      if (i === index + 1)
                                        return { ...item, active: true };
                                      else return { ...item, active: false };
                                    })
                                  );
                                }
                          }
                        >
                          <span>Next</span>
                          <ArrowRightIcon />
                        </button>
                      )}

                      {question.valueType === "day" && (
                        <button
                          disabled={!isDaysFull}
                          onClick={
                            activeSubQuestions && !display
                              ? (e) => {
                                  e.preventDefault();
                                  setdisplay(true);
                                }
                              : () => {
                                  setdisplay(false);
                                  setOverviewData((data) =>
                                    data.map((item, i) => {
                                      if (i === index + 1)
                                        return { ...item, active: true };
                                      else return { ...item, active: false };
                                    })
                                  );
                                }
                          }
                        >
                          <span>Next day</span>
                          <ArrowRightIcon />
                        </button>
                      )}

                      {question.valueType === "time" && (
                        <button
                          disabled={!isTimesFull}
                          onClick={
                            activeSubQuestions && !display
                              ? (e) => {
                                  e.preventDefault();
                                  setdisplay(true);
                                }
                              : () => {
                                  setdisplay(false);
                                  setOverviewData((data) =>
                                    data.map((item, i) => {
                                      if (i === index + 1)
                                        return { ...item, active: true };
                                      else return { ...item, active: false };
                                    })
                                  );
                                }
                          }
                        >
                          <span>Next time</span>
                          <ArrowRightIcon />
                        </button>
                      )}

                      {question.valueType !== "form" &&
                        question.valueType !== "day" &&
                        question.valueType !== "time" &&
                        isTheSubQuestionOpen === false && (
                          <button
                            disabled={!doesActiveQuestionHaveValue}
                            onClick={
                              activeSubQuestions && !display
                                ? (e) => {
                                    e.preventDefault();
                                    setdisplay(true);
                                  }
                                : () => {
                                    setdisplay(false);
                                    setOverviewData((data) =>
                                      data.map((item, i) => {
                                        if (i === index + 1)
                                          return { ...item, active: true };
                                        else return { ...item, active: false };
                                      })
                                    );
                                  }
                            }
                          >
                            <span>Next</span>
                            <ArrowRightIcon />
                          </button>
                        )}

                      {isTheSubQuestionOpen && (
                        <button
                          disabled={!isAllSubQuestionDataFull}
                          onClick={(e) => {
                            if (activeSubQuestions && !display) {
                              e.preventDefault();
                              setdisplay(true);
                            } else {
                              setdisplay(false);
                              setOverviewData((data) =>
                                data.map((item, i) => {
                                  if (i === index + 1) {
                                    return { ...item, active: true };
                                  } else {
                                    return { ...item, active: false };
                                  }
                                })
                              );
                            }
                            setIsAllSubQuestionDataFull(false);
                          }}
                        >
                          <span>Next Sub</span>
                          <ArrowRightIcon />
                        </button>
                      )} */}

                      {isTheSubQuestionOpen ? (
                        <button
                          disabled={!isAllSubQuestionDataFull}
                          onClick={(e) => {
                            if (activeSubQuestions && !display) {
                              e.preventDefault();
                              setdisplay(true);
                            } else {
                              setdisplay(false);
                              setOverviewData((data) =>
                                data.map((item, i) => {
                                  if (i === index + 1) {
                                    return { ...item, active: true };
                                  } else {
                                    return { ...item, active: false };
                                  }
                                })
                              );
                            }

                            setIsTheSubQuestionOpen(false);
                            setIsAllSubQuestionDataFull(false);
                          }}
                        >
                          <span>Next</span>
                          <ArrowRightIcon />
                        </button>
                      ) : (
                        <>
                          {question.valueType === "form" && (
                            <button
                              disabled={!isFormDataFull}
                              onClick={(e) => {
                                if (activeSubQuestions && !display) {
                                  e.preventDefault();
                                  setdisplay(true);
                                } else {
                                  setdisplay(false);
                                  setOverviewData((data) =>
                                    data.map((item, i) => {
                                      if (i === index + 1) {
                                        return { ...item, active: true };
                                      } else {
                                        return { ...item, active: false };
                                      }
                                    })
                                  );
                                }
                                isSubOpen(false);
                              }}
                            >
                              <span>Next</span>
                              <ArrowRightIcon />
                            </button>
                          )}

                          {question.valueType === "day" && (
                            <button
                              disabled={!isDaysFull}
                              onClick={(e) => {
                                if (activeSubQuestions && !display) {
                                  e.preventDefault();
                                  setdisplay(true);
                                } else {
                                  setdisplay(false);
                                  setOverviewData((data) =>
                                    data.map((item, i) => {
                                      if (i === index + 1) {
                                        return { ...item, active: true };
                                      } else {
                                        return { ...item, active: false };
                                      }
                                    })
                                  );
                                }
                                isSubOpen(false);
                              }}
                            >
                              <span>Next</span>
                              <ArrowRightIcon />
                            </button>
                          )}

                          {question.valueType === "time" && (
                            <button
                              disabled={!isTimesFull}
                              onClick={(e) => {
                                if (activeSubQuestions && !display) {
                                  e.preventDefault();
                                  setdisplay(true);
                                } else {
                                  setdisplay(false);
                                  setOverviewData((data) =>
                                    data.map((item, i) => {
                                      if (i === index + 1) {
                                        return { ...item, active: true };
                                      } else {
                                        return { ...item, active: false };
                                      }
                                    })
                                  );
                                }
                                isSubOpen(false);
                              }}
                            >
                              <span>Next</span>
                              <ArrowRightIcon />
                            </button>
                          )}

                          {question.valueType !== "form" &&
                            question.valueType !== "day" &&
                            question.valueType !== "time" && (
                              <button
                                disabled={!doesActiveQuestionHaveValue}
                                onClick={(e) => {
                                  if (activeSubQuestions && !display) {
                                    e.preventDefault();
                                    setdisplay(true);
                                  } else {
                                    setdisplay(false);
                                    setOverviewData((data) =>
                                      data.map((item, i) => {
                                        if (i === index + 1) {
                                          return { ...item, active: true };
                                        } else {
                                          return { ...item, active: false };
                                        }
                                      })
                                    );
                                  }

                                  isSubOpen(false);
                                }}
                              >
                                <span>Next</span>
                                <ArrowRightIcon />
                              </button>
                            )}
                        </>
                      )}
                    </BtnsContainer>
                  </DocumentQuestion>
                )
            )
          ) : (
            <DocumentQuestionsOverview
              isDraft={isDraft}
              data={overviewData}
              onClick={(index: number) => {
                setOverviewData((data) =>
                  data.map((q, i) =>
                    i === index
                      ? { ...q, active: true }
                      : { ...q, active: false }
                  )
                );
              }}
            />

            // <button
            //   onClick={() => {
            //     console.log(overviewData);
            //   }}
            // >
            //   Get all the entered data
            // </button>
          )}
        </Content>
      </Container>
    </>
  );
};

export default DocumentQuestions;
