import { ReactNode, useMemo, useState, useEffect, useCallback } from "react";
import Form from "../../../ui/AuthForm";
import { extractChoicesFromString } from "../../../utils/helpers";
import styled from "styled-components";
import { HiMiniChevronDown } from "react-icons/hi2";
import { HiMiniChevronUp } from "react-icons/hi2";
import { API } from "../../../utils/constants";
import { getApiConfig } from "../../../utils/constants";
import { IoMdRemove } from "react-icons/io";
import axios from "axios";
import { IoIosClose } from "react-icons/io";

import MapContainer from "../../../ui/map/MapContainer";

const Checkbox = styled.input`
  /* accent-color: var(--color-stone-300); */
  /* border: none; */
  position: relative;
  width: 2rem;
  height: 2rem;
  appearance: none;
  border-radius: 50%;

  &:focus {
    border-radius: 50%;
  }
  box-shadow: var(--shadow);
  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }
  &::before {
    background-color: var(--white);
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
  }
  &::after {
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-stone-600);
    width: 1rem;
    height: 1rem;
  }
  &:checked::after {
    opacity: 1;
  }
  &:checked::before {
    background-color: var(--color-stone-150);
    border: 1px solid var(--color-stone-500);
  }
`;
const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  & > div {
    display: grid;
    grid-template-columns: repeat(2, min-content);
    grid-template-columns: min-content max-content;
    align-items: center;
    gap: 1rem;
    label {
      font-size: 1.5rem;
      color: var(--color-grey-500);
      font-weight: 500;
      cursor: pointer;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }
`;

const Description = styled.div`
  /* font-size: 1.6rem; */

  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-grey-500);
  font-size: 1.3rem;
`;
const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  gap: 1rem;
  button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-grey-500);
    font-weight: 500;
    background-color: var(--color-stone-150);
    border: none;
    padding: 0.6rem 1.5rem;
    font-size: 1.3rem;
    border-radius: var(--rounded-3xl);
    box-shadow: var(--shadow);
  }
`;
const Details = styled(Description)`
  align-self: center;
  display: inline-block;
  background-color: var(--color-stone-150);
  padding: 2rem 3rem;
  border-radius: var(--rounded);
  box-shadow: var(--shadow-sm);
  color: var(--color-grey-500);
  font-size: 1.3rem;
  font-weight: 500;
`;
const InputContainer = styled.div`
  width: 50vw;
  align-self: center;
  /* 900px */
  @media screen and (max-width: 56.25em) {
    width: 60vw;
  }
  /* 600px */
  @media screen and (max-width: 37.5em) {
    width: 75vw;
  }
  /* 500px */
  @media screen and (max-width: 25em) {
    width: 85vw;
  }
`;
const Input = styled(Form.Input)`
  padding: 0.8rem 1.2rem;
`;
const Textarea = styled(Form.Textarea)`
  width: 100%;
  min-height: 12rem;
`;
const DocumentSubQuestion = ({
  question,
  children,
  value,
  setValue,
  subOpen,
  subQuestions,
  data,
  mainQuestionId,
  isSDataFull,
}: {
  question: SubQuestion;
  children: ReactNode;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  if (typeof question === "undefined") return null;
  const choices = useMemo(
    () => extractChoicesFromString(question!.valueType),
    [question!.valueType]
  );

  // get the subquestions data

  const getSubQuestionData = useCallback(() => {
    // Find the sub-question data for the current main question
    const subQuestionData = data?.find((q) => q.questionId === mainQuestionId);

    // Return the sub-questions
    return subQuestionData ? subQuestionData.subQuestions : [];
  }, [data, mainQuestionId]); // Dependencies: data and mainQuestionId

  // get the subquestion data

  const getSubquestion = () => {
    const subQuestionData = getSubQuestionData()?.find(
      (e) => e.subQuestionId === question.id
    );

    return subQuestionData.subQuestionValue;
  };

  const [formBlocks, setFormBlocks] = useState([]);
  const [formData, setFormData] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const [isAllDataEntered, setIsAllDataEntered] = useState(false);

  // Fetch form blocks and filter data
  useEffect(() => {
    const getFormBlocks = async () => {
      if (question?.valueType === "form") {
        try {
          const result = await axios.get(
            `${API}/suser/sub-question-details/${question.id}`,
            getApiConfig()
          );
          setFormBlocks(result?.data.form.blocks);
        } catch (err) {
          console.log(err);
        }
      }
    };

    const getFilterData = async () => {
      if (question?.valueType === "filter") {
        try {
          const result = await axios.get(
            `${API}/suser/sub-question-details/${question.id}`,
            getApiConfig()
          );
          setFilterData(result?.data.filter);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getFormBlocks();
    getFilterData();
  }, [question.id, question?.valueType]);

  useEffect(() => {
    subOpen(true);
  }, [subOpen]);

  // =============  day ===========

  const isDaysHaveValues = () => {
    return (
      Array.isArray(getSubquestion()) &&
      getSubquestion().length >= 2 &&
      getSubquestion()[0]?.day &&
      getSubquestion()[1]?.day
    );
  };

  const [days, setDays] = useState(() => {
    if (isDaysHaveValues()) {
      return [
        { index: 0, day: getSubquestion()[0]?.day },
        { index: 1, day: getSubquestion()[1]?.day },
      ];
    } else {
      return [
        { index: 0, day: "" },
        { index: 1, day: "" },
      ];
    }
  });

  const handleSelectChange = (index, event) => {
    const newDays = days.map((day) =>
      day.index === index ? { ...day, day: event.target.value } : day
    );
    setDays(newDays);
    setValue(newDays, question.valueType);
  };

  const isSecondDayDisabled = days[0]?.day === "";

  // ============ time ==========

  const isTimesHaveValues = () => {
    return (
      Array.isArray(getSubquestion()) &&
      getSubquestion().length >= 2 &&
      getSubquestion()[0]?.time &&
      getSubquestion()[1]?.time
    );
  };

  // Initialize state based on a condition
  const [times, setTimes] = useState(() => {
    if (isTimesHaveValues()) {
      return [
        { index: 0, time: getSubquestion()[0].time },
        { index: 1, time: getSubquestion()[1].time },
      ];
    } else {
      return [
        { index: 0, time: "" },
        { index: 1, time: "" },
      ];
    }
  });

  // Handle time changes
  const handleTimeChange = (index, event) => {
    const newTimes = times?.map((time) =>
      time.index === index ? { ...time, time: event.target.value } : time
    );
    setTimes(newTimes);
    setValue(newTimes, question.valueType); // Assuming setValue is defined elsewhere
  };

  const isSecondTimeDisabled = times[0]?.time === "";

  // ===============  filter =============

  const isTheFilterHavAvalue = useCallback(() => {
    return getSubquestion() !== "";
  }, [getSubquestion()]);

  const [Fvalue, setFValue] = useState(() => {
    if (isTheFilterHavAvalue()) {
      return Number(getSubquestion());
    } else if (
      filterData &&
      filterData?.filterStartInt !== undefined &&
      filterData?.filterEndInt !== undefined
    ) {
      return (+filterData?.filterStartInt + filterData?.filterEndInt) / 2;
    } else {
      return 0;
    }
  });

  const handleSliderChange = (event) => {
    const newValue = Number(event.target.value);

    setFValue(newValue);
    setValue(newValue, question.valueType);
  };

  // ================ form ================

  // Fetch form blocks and filter data
  useEffect(() => {
    const getFormBlocks = async () => {
      if (question?.valueType === "form") {
        try {
          const result = await axios.get(
            `${API}/suser/question-details/${question.id}`,
            getApiConfig()
          );
          setFormBlocks(result?.data.form.blocks);
        } catch (err) {
          console.log(err);
        }
      }
    };

    const getFilterData = async () => {
      if (question?.valueType === "filter") {
        try {
          const result = await axios.get(
            `${API}/suser/question-details/${question.id}`,
            getApiConfig()
          );
          setFilterData(result?.data.filter);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getFormBlocks();
    getFilterData();
  }, [question.id, question?.valueType]);

  // Initialize form data with props value
  useEffect(() => {
    if (getSubquestion()) {
      setFormData(getSubquestion());
    }
  }, [getSubquestion()]);

  // Count total inputs
  const countTotalInputs = (blocks) => {
    return blocks.reduce((total, block) => total + block?.labels.length, 0);
  };

  // Calculate total inputs
  const totalInputs = countTotalInputs(formBlocks);

  // Update form errors when form blocks change
  useEffect(() => {
    const initialFormErrors = formBlocks?.flatMap((block) =>
      block?.labels?.map(() => "")
    );
    setFormErrors(initialFormErrors);
  }, [formBlocks]);

  // Handle input change
  // const handleChange = useCallback(
  //   (blockId, labelId, value) => {
  //     setFormData((prevFormData) => {
  //       const updatedFormData = prevFormData?.filter(
  //         (item) => !(item?.blockId === blockId && item?.labelId === labelId)
  //       );

  //       if (value.trim() !== "") {
  //         updatedFormData.push({ blockId, labelId, LabelValue: value });
  //       }

  //       setValue(updatedFormData); // Pass updated data to setValue

  //       return updatedFormData;
  //     });
  //   },
  //   [totalInputs, setValue]
  // );

  const handleChange = useCallback(
    (blockId, labelId, value, questionText) => {
      setFormData((prevFormData) => {
        const updatedFormData = prevFormData.filter(
          (item) => !(item?.blockId === blockId && item?.labelId === labelId)
        );

        if (value.trim() !== "") {
          updatedFormData.push({
            blockId,
            labelId,
            LabelValue: value,
            questionText,
          });
        }

        // Update form data and check if all data is entered
        const allInputsFilled = updatedFormData?.length === totalInputs;
        setIsAllDataEntered(allInputsFilled);

        setValue(updatedFormData, question.valueType); // Pass updated data to setValue

        return updatedFormData;
      });
    },
    [totalInputs, setValue]
  );

  // ===========  checking is all subquestions values is not null =======

  const idAllSubQuestionsValuesIsNotNull = useCallback(() => {
    // Get sub-question data
    const subQuestionData = getSubQuestionData();

    // Check if all sub-question values are not empty
    const allValuesNotEmpty = subQuestionData?.every(
      (e) => e.subQuestionValue !== ""
    );

    return allValuesNotEmpty;
  }, [getSubQuestionData]); // Include getSubQuestionData as a dependency

  useEffect(() => {
    const isDataFull = idAllSubQuestionsValuesIsNotNull();
    isSDataFull(isDataFull);
  }, [idAllSubQuestionsValuesIsNotNull, isSDataFull]);

  return (
    <>
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "23px",
          }}
        >
          {question.questionText}
        </h2>
        <Description>{question?.Description}</Description>
      </div>
      <DetailsContainer>
        <button
          onClick={() => setShowDetails((show) => !show)}
          // disabled={disabled}
        >
          <span>{showDetails ? "Hide " : "Show"} details</span>
          {showDetails ? <HiMiniChevronUp /> : <HiMiniChevronDown />}
        </button>
        {showDetails && <Details>{question.description_details}</Details>}
      </DetailsContainer>
      <InputContainer>
        {question.valueType === "number" && (
          <Input
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value, question.valueType)}
            type="number"
          />
        )}

        {question.valueType === "input" && (
          <Input
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value, question.valueType)}
            type="text"
          />
        )}

        {question.valueType === "textarea" && (
          <Textarea
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value, question.valueType)}
          />
        )}

        {question.valueType.startsWith("checkbox") && (
          <Choices>
            {choices.map((choice) => (
              <div key={choice.id}>
                <Checkbox
                  name="choice"
                  id={choice.choice}
                  value={choice.newRelatedText}
                  type="radio"
                  onChange={() => setValue(choice.newRelatedText, "checkbox")}
                  checked={value === choice.newRelatedText}
                />
                <label htmlFor={choice.choice}>{choice.choice}</label>
              </div>
            ))}
          </Choices>
        )}

        {question.valueType.startsWith("date") && (
          <div className="daysofwork_container">
            <div className="select_input">
              <input
                type="date"
                onChange={(e) => {
                  setValue(e.target.value, question.valueType);
                }}
                value={value}
              />
            </div>
          </div>
        )}

        {question.valueType.startsWith("day") && (
          <div className="daysofwork_container">
            <div className="select_input">
              <select
                id="daysOfWeek1"
                value={days[0]?.day}
                onChange={(e) => handleSelectChange(0, e)}
              >
                <option value="">Select a day</option>
                <option value="Mandag">Mandag</option>
                <option value="Tirsdag">Tirsdag</option>
                <option value="Onsdag">Onsdag</option>
                <option value="Torsdag">Torsdag</option>
                <option value="Fredag">Fredag</option>
                <option value="Lørdag">Lørdag</option>
                <option value="Søndag">Søndag</option>
              </select>
            </div>
            <div className="separator">
              <IoMdRemove />
            </div>
            <div className="select_input">
              <select
                id="daysOfWeek2"
                value={days[1]?.day}
                onChange={(e) => handleSelectChange(1, e)}
                disabled={isSecondDayDisabled}
              >
                <option value="">Select a day</option>
                <option value="Mandag">Mandag</option>
                <option value="Tirsdag">Tirsdag</option>
                <option value="Onsdag">Onsdag</option>
                <option value="Torsdag">Torsdag</option>
                <option value="Fredag">Fredag</option>
                <option value="Lørdag">Lørdag</option>
                <option value="Søndag">Søndag</option>
              </select>
            </div>
          </div>
        )}

        {question.valueType.startsWith("time") && (
          <div className="daysofwork_container">
            <div className="select_input">
              <input
                type="time"
                value={times[0]?.time}
                onChange={(event) => handleTimeChange(0, event)}
              />
            </div>
            <div className="separator">
              <IoMdRemove />
            </div>
            <div className="select_input">
              <input
                type="time"
                value={times[1]?.time}
                onChange={(event) => handleTimeChange(1, event)}
                disabled={isSecondTimeDisabled}
              />
            </div>
          </div>
        )}

        {question.valueType.startsWith("filter") && (
          <div>
            <h3>{Fvalue}</h3>
            <input
              type="range"
              min={filterData?.filterStartInt}
              max={filterData?.filterEndInt}
              value={Fvalue}
              onChange={handleSliderChange}
              style={{ outline: "none" }}
            />
          </div>
        )}

        {/* {question.valueType.startsWith("form") && (
          <div className="form_type">
            {formBlocks?.map((block) => {
              
              if (!block?.labels || block?.labels.length === 0) {
                return null; 
              }

              return (
                <div className="form-block-user" key={block?.id}>
                  <IoIosClose className="form_type_controllers" size={20} />
                  {block.labels?.map((label) => {
                    const existingData = formData?.find(
                      (data) =>
                        data?.blockId === block?.id &&
                        data?.labelId === label?.id
                    );
                    const fieldValue = existingData
                      ? existingData.LabelValue
                      : "";

                    const handleInputChange = (e) => {
                      const { value } = e.target;
                      handleChange(block?.id, label?.id, value);
                    };

                    return (
                      <div key={label.id} className="block-input">
                        <label>{label.name}</label>
                        {label.type === "SELECT" ? (
                          <select
                            name={label.name}
                            value={fieldValue}
                            onChange={handleInputChange}
                          >
                            <option value="">Select an option</option>
                            {Object.keys(label.options)?.map((key) => (
                              <option key={key} value={label.options[key]}>
                                {label.options[key]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={label.type}
                            name={label.name}
                            value={fieldValue}
                            placeholder={label.name}
                            onChange={handleInputChange}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )} */}

        {question.valueType.startsWith("form") && (
          <div className="form_type">
            {formBlocks?.map((block) => {
              // Check if the block has any labels
              if (!block?.labels || block?.labels.length === 0) {
                return null; // Skip rendering this block if it has no labels
              }

              return (
                <div className="form-block-user" key={block?.id}>
                  {/* <IoIosClose className="form_type_controllers" size={20} /> */}
                  {block.labels?.map((label) => {
                    const existingData = formData?.find(
                      (data) =>
                        data?.blockId === block?.id &&
                        data?.labelId === label?.id
                    );
                    const fieldValue = existingData
                      ? existingData.LabelValue
                      : "";
                    const questionText = label.name;

                    const handleInputChange = (e) => {
                      const { value } = e.target;
                      handleChange(block?.id, label?.id, value, questionText);
                    };

                    return (
                      <div key={label.id} className="block-input">
                        <label>{label.name}</label>
                        {label.type === "SELECT" ? (
                          <select
                            name={label.name}
                            value={fieldValue}
                            onChange={handleInputChange}
                          >
                            <option value="">Select an option</option>
                            {Object.keys(label.options)?.map((key) => (
                              <option key={key} value={label.options[key]}>
                                {label.options[key]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={label.type}
                            name={label.name}
                            value={fieldValue}
                            placeholder={label.name}
                            onChange={handleInputChange}
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

        {question.valueType.startsWith("map") && (
          <MapContainer
            getTheMapData={(value) => {
              setValue(value);
            }}
          />
        )}

        {children}
      </InputContainer>
    </>
  );
};

export default DocumentSubQuestion;
