import styled from "styled-components";
import { useTemplate } from "../../Templates/useTemplate";
import DocumentQuestion from "./DocumentQuestion";
import { useState } from "react";
import {
  HiArrowSmRight as ArrowRightIcon,
  HiArrowSmLeft as ArrowLeftIcon,
} from "react-icons/hi";

import DocumentQuestionsOverview from "../../Documents/DocumentQuestionsOverview";
import QuestiontsSlider from "../../../ui/QuestiontsSlider";
import DocumentHeader from "../../Documents/DocumentHeader";
import DocumentSubQuestion from "./DocumentSubQuestion";

import { useParams } from "react-router-dom";

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
  // FROM THE TEMPLETE HE GETS THE QUESTIONS DATA
  const { template } = useTemplate();
  const ALLquestions = template!.questions;
  const questions = flattenSubQuestions(ALLquestions);
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
      type: string;
      value: any;
      subQuestions?: {
        subQuestionId: number;
        subQuestionText: string;
        subQuestionValue: any;
        type: string;
      }[];
      active: boolean;
    }[]
  >(() => {
    const questionsValuesExist =
      typeof documentQuestionsValues !== "undefined" &&
      documentQuestionsValues.length > 0;

    return questions.map((q, i) => {
      const questionValues =
        documentQuestionsValues?.find((item) => item.questionId === q.id) || {};
      const subQuestionsValues =
        questionsValuesExist && questionValues
          ? questionValues.subQuestions || []
          : [];
      return {
        questionText: q.questionText,
        type: q.valueType,
        questionId: q.id,
        value: questionsValuesExist
          ? documentQuestionsValues.find((item) => item.questionId === q.id)
              ?.value
          : "",
        active: questionsValuesExist
          ? i === documentQuestionsValues.length - 1
          : i == 0,
        subQuestions: q.subQuestions?.map((subQ) => {
          const subQuestionValue = subQuestionsValues.find(
            (sqv) => sqv.subQuestionId === subQ.id
          );
          return {
            subQuestionId: subQ.id,
            subQuestionText: subQ.questionText,
            subQuestionValue: subQuestionValue
              ? subQuestionValue.subQuestionValue
              : "",
            type: subQ.valueType,
          };
        }),
      };
    });
  });

  const isDraft = overviewData.some((q) => !q.value);

  const params = useParams();

  const activeQuestion = overviewData.find((q) => q.active);

  const activeQuestionIndex = overviewData.findIndex(
    (q) => q === activeQuestion
  );

  const activeSubQuestions = questions[activeQuestionIndex]?.subQuestions || [];

  const doesActiveQuestionHaveValue = activeQuestion?.value !== "";

  // console.log("activeQuestion = ", activeQuestion);

  const handleSetValue = (id: number, newValue: any, type: string) => {
    // here he saves the input data
    setOverviewData((current) =>
      current.map((q) => ({
        ...q,
        subQuestions: q.subQuestions?.map((subQ) =>
          subQ.subQuestionId === id
            ? { ...subQ, subQuestionValue: newValue, type }
            : subQ
        ),
      }))
    );
  };

  const isTherFormDataHandler = (value) => {
    setIsFormDataFull(value);
  };

  const [isMapDataFull, setIsMapDataFull] = useState(false);

  const isMapDatafullHandler = (value) => {
    setIsMapDataFull(value);
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

  function flattenSubQuestions(questions) {
    return questions.map((question) => {
      let flattenedQuestion = { ...question };

      // Recursively process subQuestions
      if (
        flattenedQuestion.subQuestions &&
        flattenedQuestion.subQuestions.length > 0
      ) {
        flattenedQuestion.subQuestions = flattenSubQuestions(
          flattenedQuestion.subQuestions
        );

        // Extract nested subQuestions from all levels
        const nestedSubQuestions = flattenedQuestion.subQuestions.flatMap(
          (q) => q.subQuestions
        );
        flattenedQuestion.subQuestions = [
          ...flattenedQuestion.subQuestions.map((q) => ({
            ...q,
            subQuestions: [],
          })),
          ...nestedSubQuestions,
        ];
      }

      return flattenedQuestion;
    });
  }

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
            questions
              // .sort((a, b) => a.position - b.position)
              .map((question, index) =>
                overviewData.at(index)?.active ? (
                  <DocumentQuestion
                    key={question.id}
                    question={question}
                    value={overviewData.at(index)?.value || ""}
                    setValue={(value: any, type: string) =>
                      setOverviewData((current) =>
                        current.map((q, i) =>
                          i === index ? { ...q, value, type } : q
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
                    isMapDataFullAdded={(value) => {
                      isMapDatafullHandler(value);
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
                                ?.subQuestionValue as any
                            }
                            setValue={(value: any, type: string) =>
                              handleSetValue(sq.id, value, type)
                            }
                            subOpen={(value) => {
                              isSubOpen(value);
                            }}
                            isSDataFull={(value) => {
                              isSubDataFull(value);
                            }}
                            isMapDataFullAdded={(value) => {
                              isMapDatafullHandler(value);
                            }}
                          />
                        ))
                      : null}

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
                              <span>Next 0000</span>
                              <ArrowRightIcon />
                            </button>
                          )}

                          {question.valueType === "map" && (
                            <button
                              disabled={!isMapDataFull}
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
                              <span>Next map</span>
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
                              <span>Next 000</span>
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
                              <span>Next 000</span>
                              <ArrowRightIcon />
                            </button>
                          )}

                          {question.valueType !== "form" &&
                            question.valueType !== "day" &&
                            question.valueType !== "time" &&
                            question.valueType !== "map" && (
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
                                <span>Next 0000</span>
                                <ArrowRightIcon />
                              </button>
                            )}
                        </>
                      )}
                    </BtnsContainer>
                  </DocumentQuestion>
                ) : null
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
          )}
        </Content>

        <button
          onClick={() => {
            console.log(overviewData);
            console.log(questions);
            console.log(ALLquestions);
          }}
        >
          test
        </button>
      </Container>
    </>
  );
};

export default DocumentQuestions;
