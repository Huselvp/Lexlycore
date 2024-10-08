import styled from "styled-components";
import { FaEdit as EditIcon } from "react-icons/fa";
import { useAddUpdateDocumentQuestion } from "./useAddUpdateDocumentQuestion";
import { useInitiatePayment } from "../Payment/useInitiatePayment";
import React, { useState } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

const SubHeader = styled.p`
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-grey-500);
  font-size: 1.3rem;
`;

const Content = styled.div`
  text-align: start;
  box-shadow: var(--shadow);
  /* padding: 2.5rem 2.5rem 0.5rem; */
  padding: 1rem 1.5rem;
  background-color: var(--white);
  border-radius: var(--rounded-lg);
  ul {
    display: flex;
    flex-direction: column;
    & > li:not(:last-child) {
      border-bottom: 1px solid var(--color-grey-200);
    }
    li {
      padding: 1.25rem 0;
      display: grid; /* Remove grid layout for main question */
      grid-template-columns: 1fr min-content; /* Remove for main question */
      gap: 0.25rem 2rem; /* Adjust gap if needed */
      align-items: start;
      & p:first-child {
        color: var(--color-stone-500);
        font-size: 1.7rem;
        font-weight: 600;
      }
      & p:last-child {
        color: var(--color-grey-500);
        font-weight: 500;
        font-size: 1.4rem;
        /* font-size: 1.5rem; */
      }
      button {
        /* align-self: start; */
        border: none;
        background: none;
        svg {
          color: var(--color-stone-500);
          width: 1.75rem;
          height: 1.75rem;
        }
      }
    }
    li.sub-question {
      /* Add class for subquestions */
      padding-left: 2rem; /* Indent subquestions */
      border-bottom: none; /* Remove bottom border for subquestions */
    }
  }
`;
const BtnsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  button {
    background: none;
    border: none;
    background-color: var(--color-stone-500);
    color: var(--white);
    padding: 1rem 2.5rem;
    border-radius: var(--rounded-3xl);
    font-weight: 500;
    font-size: 1.4rem;
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

const DocumentQuestionsOverview = ({
  data,
  isDraft,
  onClick,
}: {
  data: {
    type: unknown;
    questionText: string;
    questionId: number;
    value: unknown;
    subQuestions?: {
      type: string;
      subQuestionId: number;
      subQuestionText: string;
      subQuestionValue: unknown;
    }[];
    active: boolean;
  }[];
  onClick: (index: number) => void;
  isDraft: boolean;
}) => {
  const [caret_icon_active, setCaretIconActive] = useState<boolean[]>(
    data.map(() => false)
  );

  const { isLoading: isLoading1, addUpdateDocumentQuestion } =
    useAddUpdateDocumentQuestion();
  const { isLoading: isLoading2, initiatePayment } = useInitiatePayment();
  const isLoading = isLoading1 || isLoading2;

  const clickHandler = () => {
    const values = data.map((item) => {
      return {
        questionId: item.questionId,
        value: item.value,
        type: item.type,
        subquestionsValues:
          item.subQuestions && item.subQuestions.length > 0
            ? item.subQuestions.map((sub) => ({
                subQuestionId: sub.subQuestionId,
                value: sub.subQuestionValue,
                type: sub.type,
              }))
            : [],
      };
    });

    addUpdateDocumentQuestion(
      { values, isDraft },
      {
        onSuccess: () => {
          if (localStorage.getItem("access_token") === "") {
            return;
          } else {
            initiatePayment();
          }
        },
      }
    );
  };

  const toggleSubQuestions = (index: number) => {
    const newCaretState = [...caret_icon_active];
    newCaretState[index] = !newCaretState[index];
    setCaretIconActive(newCaretState);
  };

  const convertStringToAddressObject = (dataString : unknown) => {
    if (typeof dataString !== "string") {
      return {
        apartment: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        x: null,
        y: null,
      };
    }

    const parts = dataString.split(", ");

    return {
      apartment: parts[0] || "",
      address: parts[1] || "",
      city: parts[2] || "",
      country: parts[3] || "",
      postal_code: parts[4] || "",
      x: parts[5] ? parseFloat(parts[5]) : null,
      y: parts[6] ? parseFloat(parts[6]) : null,
    };
  };

  return (
    <>
      <div>
        <h2>Overview</h2>
        <SubHeader>Look through your answers.</SubHeader>
      </div>
      <Content>
        <ul>
          {data.map((item, i) => (
            <>
              {item.type !== "form" &&
                item.type !== "day" &&
                item.type !== "time" &&
                item.type !== "map" && (
                  <li key={i}>
                    <p>
                      {item?.subQuestions?.length > 0 ? (
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={() => toggleSubQuestions(i)}
                        >
                          {!caret_icon_active[i] ? (
                            <RxCaretDown />
                          ) : (
                            <RxCaretUp />
                          )}
                        </button>
                      ) : null}
                      {item.questionText}
                    </p>
                    <button onClick={() => onClick(i)}>
                      <EditIcon />
                    </button>
                    <p>{item.value}</p>
                  </li>
                )}

              {item.type === "time" && (
                <li key={i}>
                  {item?.subQuestions?.length > 0 ? (
                    <button
                      style={{ background: "none", border: "none" }}
                      onClick={() => toggleSubQuestions(i)}
                    >
                      {!caret_icon_active[i] ? <RxCaretDown /> : <RxCaretUp />}
                    </button>
                  ) : null}
                  <p>{item.questionText}</p>
                  <button onClick={() => onClick(i)}>
                    <EditIcon />
                  </button>
                  <p>
                    {item.value[0].time}
                    {"-"}
                    {item.value[1].time}
                  </p>
                </li>
              )}

              {item?.type === "map" && (
                <li
                  key={i}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {(() => {
                    const mapValues = convertStringToAddressObject(item.value);
                    return (
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {item?.subQuestions?.length > 0 ? (
                              <button
                                style={{ background: "none", border: "none" }}
                                onClick={() => toggleSubQuestions(i)}
                              >
                                {!caret_icon_active[i] ? (
                                  <RxCaretDown />
                                ) : (
                                  <RxCaretUp />
                                )}
                              </button>
                            ) : null}
                            <p
                              style={{
                                color: "var(--color-stone-500)",
                                fontSize: "1.7rem",
                                fontWeight: "600",
                              }}
                            >
                              {item.questionText}
                            </p>
                          </div>
                          <button onClick={() => onClick(i)}>
                            <EditIcon />
                          </button>
                        </div>
                        <div>
                          <p>{`${mapValues.apartment}, ${mapValues.address}, ${mapValues.city}, ${mapValues.country}, ${mapValues.postal_code}`}</p>
                        </div>
                      </div>
                    );
                  })()}
                </li>
              )}

              {item.type === "form" && (
                <li
                  key={i}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {item?.subQuestions?.length > 0 ? (
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={() => toggleSubQuestions(i)}
                        >
                          {!caret_icon_active[i] ? (
                            <RxCaretDown />
                          ) : (
                            <RxCaretUp />
                          )}
                        </button>
                      ) : null}
                      <p
                        style={{
                          color: "var(--color-stone-500)",
                          fontSize: "1.7rem",
                          fontWeight: "600",
                        }}
                      >
                        {item.questionText}
                      </p>
                    </div>
                    <button onClick={() => onClick(i)}>
                      <EditIcon />
                    </button>
                  </div>
                  <div>
                    {item.value?.map((q) => {
                      return (
                        <div key={q.questionText}>
                          <p>{q.questionText}</p>
                          <p>{q.LabelValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </li>
              )}

              {item.type === "day" && (
                <li key={i}>
                  {item?.subQuestions?.length > 0 ? (
                    <button
                      style={{ background: "none", border: "none" }}
                      onClick={() => toggleSubQuestions(i)}
                    >
                      {!caret_icon_active[i] ? <RxCaretDown /> : <RxCaretUp />}
                    </button>
                  ) : null}
                  <p>{item.questionText}</p>
                  <button onClick={() => onClick(i)}>
                    <EditIcon />
                  </button>
                  <p>
                    {item.value[0].day}
                    {"-"}
                    {item.value[1].day}
                  </p>
                </li>
              )}

              {caret_icon_active[i] && (
                <div>
                  {item?.subQuestions?.map((sq, ind) => (
                    <React.Fragment key={ind}>
                      {sq.type !== "day" &&
                        sq.type !== "time" &&
                        sq.type !== "form" &&
                        sq.type !== "map" && (
                          <li>
                            <p>{sq.subQuestionText}</p>
                            <button onClick={() => onClick(i)}>
                              <EditIcon />
                            </button>
                            <p>{sq.subQuestionValue}</p>
                          </li>
                        )}

                      {sq.type === "day" && (
                        <li>
                          <p>{sq.subQuestionText}</p>
                          <button onClick={() => onClick(i)}>
                            <EditIcon />
                          </button>
                          <p>
                            {sq.subQuestionValue[0]?.day}
                            {"-"}
                            {sq.subQuestionValue[1]?.day}
                          </p>
                        </li>
                      )}

                      {sq.type === "map" &&
                        (() => {
                          const mapValues = convertStringToAddressObject(
                            sq.subQuestionValue
                          );

                          return (
                            <li key={i}>
                              <p>{sq.subQuestionText}</p>
                              <button onClick={() => onClick(i)}>
                                <EditIcon />
                              </button>
                              <p>{`${mapValues.apartment}, ${mapValues.address}, ${mapValues.city}, ${mapValues.country}, ${mapValues.postal_code}`}</p>
                            </li>
                          );
                        })()}

                      {sq.type === "time" && (
                        <li>
                          <p>{sq.subQuestionText}</p>
                          <button onClick={() => onClick(i)}>
                            <EditIcon />
                          </button>
                          <p>
                            {sq.subQuestionValue[0]?.time}
                            {"-"}
                            {sq.subQuestionValue[1]?.time}
                          </p>
                        </li>
                      )}

                      {sq.type === "form" && (
                        <li
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <p
                                style={{
                                  color: "var(--color-stone-500)",
                                  fontSize: "1.7rem",
                                  fontWeight: "600",
                                }}
                              >
                                {sq.questionText}
                              </p>
                            </div>
                            <button onClick={() => onClick(i)}>
                              <EditIcon />
                            </button>
                          </div>
                          <div>
                            {sq.subQuestionValue?.map((q, qIdx) => (
                              <div key={qIdx}>
                                <p>{q.questionText}</p>
                                <p>{q.LabelValue}</p>
                              </div>
                            ))}
                          </div>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          ))}
        </ul>
      </Content>
      <BtnsContainer>
        <button onClick={clickHandler}>
          {isLoading ? "Loading..." : "Proceed To Checkout"}
        </button>
      </BtnsContainer>
    </>
  );
};

export default DocumentQuestionsOverview;
