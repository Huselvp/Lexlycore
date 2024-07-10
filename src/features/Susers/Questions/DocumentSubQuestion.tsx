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

  useEffect(() => {
    subOpen(true);
  }, [subOpen]);

  const sub_count = subQuestions.length;

  useEffect(() => {
    console.log(sub_count);
  }, [sub_count]);

  const [formBlocks, setFormBlocks] = useState([]);
  const [isAllDataIntered, setIsAllDataIntered] = useState(false);

  const [filterData, setFilterData] = useState({});

  useEffect(() => {
    if (question.valueType === "form") {
      const get_form_blocks = async () => {
        try {
          const result = await axios.get(
            `${API}/suser/sub-question-details/${question.id}`,
            getApiConfig()
          );

          setFormBlocks(result.data.form.blocks);
        } catch (err) {
          console.log(err);
        }
      };

      get_form_blocks();
    }

    if (question.valueType === "filter") {
      const get_filter_data = async () => {
        try {
          const result = await axios.get(
            `${API}/suser/sub-question-details/${question.id}`,
            getApiConfig()
          );
          console.log(result.data, "this is the filter data");
          setFilterData(result.data.filter);
        } catch (err) {
          console.log(err);
        }
      };

      get_filter_data();
    }

    console.log(question, "this is the question");
  }, [question.id, question.valueType]);

  const [formData, setFormData] = useState([]);
  const [formErrors, setFormErrors] = useState([]);

  const countTotalInputs = (formBlocks) => {
    return formBlocks.reduce((total, block) => {
      return total + block.labels.length;
    }, 0);
  };

  const totalInputs = countTotalInputs(formBlocks);

  useEffect(() => {
    const initialFormErrors = formBlocks.flatMap((block) =>
      block.labels.map((label) => "")
    );

    setFormErrors(initialFormErrors);
  }, [formBlocks]);

  const handleChange = useCallback(
    (blockId, labelId, labelName, value) => {
      const updatedFormData = formData.filter(
        (item) => !(item.blockId === blockId && item.labelId === labelId)
      );

      if (value.trim() !== "") {
        updatedFormData.push({ blockId, labelId, LabelValue: value });
      }

      setFormData(updatedFormData);
      setFormErrors(
        formBlocks.flatMap((block) =>
          block.labels.map((label) =>
            updatedFormData.some(
              (item) =>
                item.blockId === block.id &&
                item.labelId === label.id &&
                item.LabelValue.trim() !== ""
            )
              ? ""
              : `${label.name} is required`
          )
        )
      );

      const allInputsFilled = updatedFormData.length === totalInputs;
      setIsAllDataIntered(allInputsFilled);
    },
    [formData, formBlocks, totalInputs]
  );

  useEffect(() => {
    console.log(formData.length, "i am the form data");
    console.log(totalInputs, "i am the total inputs");
    console.log(formData, "i am the form data");
  }, [formData]);

  let minV = 0;
  let maxV = 100;

  const [Fvalue, setFValue] = useState((minV + maxV) / 2);

  useEffect(() => {
    if (question.valueType === "filter") {
      const range = document.getElementById("range");

      const handleInput = (e) => {
        const value = +e.target.value;
        setFValue(value); // Update state with the slider value
      };

      range.addEventListener("input", handleInput);

      // Clean up event listener on component unmount
      return () => {
        range.removeEventListener("input", handleInput);
      };
    }
  }, [question.valueType, minV, maxV]);

  const containerStyle = {
    position: "relative",
  };

  const inputStyle = {
    width: "300px",
    margin: "18px 0",
    WebkitAppearance: "none",
    width: "100%",
  };

  const inputFocusStyle = {
    outline: "none",
  };

  const [isDaysFull, setIsDaysFull] = useState(false);

  const [days, setDays] = useState([
    { index: 0, day: "" },
    { index: 1, day: "" },
  ]);

  const handleSelectChange = (index, event) => {
    const newDays = days.map((day) =>
      day.index === index ? { ...day, day: event.target.value } : day
    );
    setDays(newDays);
  };

  useEffect(() => {
    const allDaysFilled = days.every((day) => day.day !== "");
    setIsDaysFull(allDaysFilled);
  }, [days]);

  //=======================

  const [times, setTimes] = useState([
    { index: 0, time: "" },
    { index: 1, time: "" },
  ]);

  const handleTimeChange = (index, event) => {
    const newTimes = times.map((time) =>
      time.index === index ? { ...time, time: event.target.value } : time
    );
    setTimes(newTimes);
  };

  useEffect(() => {
    const allTimesFilled = times.every((time) => time.time !== "");
  }, [times]);

  const getSubQuesytionValues = () => {
    const values = data.find(
      (question) => question.questionId == mainQuestionId
    );
    return values.subQuestions;
  };

  // useEffect(()=>{
  //   data.forEach(obj => {
  //     for (const key in obj) {
  //       if (obj[key] === "") {
  //         allFilled = false;
  //         break;
  //       }
  //     }
  //   });
  // },[data])

  const areAllValuesFilled = (data) => {
    for (const obj of data) {
      for (const subQuestionValue in obj) {
        if (obj[subQuestionValue] == "") {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    const data = getSubQuesytionValues();
    const allFilled = areAllValuesFilled(data);

    console.log(allFilled);
    isSDataFull(allFilled);
  }, [data, getSubQuesytionValues]);

  return (
    <>
      <div>
        <h2>{question.questionText}</h2>
        <Description>{question.Description}</Description>
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
            onChange={(e) => setValue(e.target.value)}
            type="number"
          />
        )}

        {question.valueType === "input" && (
          <Input
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
        )}

        {question.valueType === "textarea" && (
          <Textarea
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
                  onChange={() => setValue(choice.newRelatedText)}
                  checked={value === choice.newRelatedText}
                />
                <label htmlFor={choice.choice}>{choice.choice}</label>
              </div>
            ))}
          </Choices>
        )}

        {question.valueType.startsWith("form") && (
          <div className="form_type">
            {formBlocks.map((block, blockIndex) => {
              return (
                <div className="form-block-user" key={block.id}>
                  <IoIosClose className="form_type_controllers" size={20} />
                  {block.labels.map((label, labelIndex) => {
                    const fieldName = label.name;
                    const index = blockIndex * block.labels.length + labelIndex;

                    const handleInputChange = (e) => {
                      const { value } = e.target;
                      handleChange(block.id, label.id, fieldName, value);
                    };

                    return (
                      <div
                        key={label.id}
                        className="block-input"
                        onChange={() => {
                          setValue(formData);
                        }}
                      >
                        <label>{label.name}</label>
                        {label.type === "SELECT" ? (
                          <select
                            name={label.name}
                            onChange={handleInputChange}
                          >
                            <option value="">Select an option</option>
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

        {question.valueType.startsWith("filter") && (
          <div>
            <div style={containerStyle} className="range-container">
              <h3>{Fvalue}</h3>
              <input
                type="range"
                name="range"
                id="range"
                min={filterData.filterStartInt}
                max={filterData.filterEndInt}
                value={Fvalue}
                onChange={(e) => setValue(e.target.value)}
                style={{ ...inputStyle, ...inputFocusStyle }}
              />
            </div>

            <style>
              {`
          .range-container {
            position: relative;
          }
          input[type="range"] {
            width: 300px;
            margin: 18px 0;
            -webkit-appearance: none;
            width: 100%;
          }
          input[type="range"]:focus {
            outline: none;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            background: #b6ae92;
            border-radius: 4px;
            width: 100%;
            height: 10px;
            cursor: pointer;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 24px;
            width: 24px;
            background: #fff;
            border-radius: 50%;
            border: 1px solid #b6ae92;
            margin-top: -7px;
            cursor: pointer;
          }
          input[type="range"]::-moz-range-track {
            background: purple;
            border-radius: 4px;
            width: 100%;
            height: 14px;
            cursor: pointer;
          }
          input[type="range"]::-moz-range-thumb {
            height: 24px;
            width: 24px;
            background: #fff;
            border-radius: 50%;
            border: 1px solid purple;
            margin-top: -7px;
            cursor: pointer;
          }
          input[type="range"]::-ms-track {
            background: purple;
            border-radius: 4px;
            width: 100%;
            height: 14px;
            cursor: pointer;
          }
          input[type="range"]::-ms-thumb {
            height: 24px;
            width: 24px;
            background: #fff;
            border-radius: 50%;
            border: 1px solid purple;
            margin-top: -7px;
            cursor: pointer;
          }
        `}
            </style>
          </div>
        )}

        {question.valueType.startsWith("day") && (
          <div className="daysofwork_container">
            <div
              className="select_input"
              onChange={() => {
                setValue(days);
              }}
            >
              <select
                id="daysOfWeek1"
                value={days[0].day}
                onChange={(e) => {
                  handleSelectChange(0, e);
                }}
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
                value={days[1].day}
                onChange={(e) => handleSelectChange(1, e)}
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
            {/* Log the selected days to the console for debugging */}
            {/* <pre>{JSON.stringify(days, null, 2)}</pre> */}
          </div>
        )}

        {question.valueType.startsWith("time") && (
          <div
            className="daysofwork_container"
            onChange={() => {
              setValue(times);
            }}
          >
            <div className="select_input">
              <input
                type="time"
                value={times[0].time} // Bind the value from state
                onChange={(e) => handleTimeChange(0, e)} // Update state on change
              />
            </div>
            <div className="separator">
              <IoMdRemove />
            </div>
            <div className="select_input">
              <input
                type="time"
                value={times[1].time} // Bind the value from state
                onChange={(e) => handleTimeChange(1, e)} // Update state on change
              />
            </div>
          </div>
        )}

        {question.valueType.startsWith("date") && (
          <div className="daysofwork_container">
            <div className="select_input">
              <input
                type="date"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
          </div>
        )}

        {/* <button
          onClick={() => {
            console.log(data);
            console.log(mainQuestionId);
            console.log(getSubQuesytionValues());
          }}
        >
          I am in the sub
        </button> */}

        {children}
      </InputContainer>
    </>
  );
};

export default DocumentSubQuestion;
