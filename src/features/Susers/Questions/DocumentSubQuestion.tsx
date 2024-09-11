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

import { FiUser } from "react-icons/fi";

import { BsBuildings } from "react-icons/bs";

import MMapComponent from "./MMapComponent";

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
  isMapDataFullAdded,
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
  }, [data, mainQuestionId]);

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

  const countTotalInputs = (blocks) => {
    return blocks.reduce((total, block) => total + block?.labels.length, 0);
  };

  const defaultLabels = {
    COMPANY: [
      { labelName: "Virksomhedsnavn", type: "TEXT" },
      { labelName: "Adresse", type: "TEXT" },
      { labelName: "CVR nr", type: "NUMBER" },
      { labelName: "Postnr", type: "NUMBER" },
      { labelName: "By", type: "TEXT" },
      { labelName: "Herefter otalt som", type: "TEXT" },
      { labelName: "Land", type: "SELECT" },
    ],
    PERSON: [
      { labelName: "Navn", type: "TEXT" },
      { labelName: "Adresse", type: "TEXT" },
      { labelName: "CPR nr", type: "NUMBER" },
      { labelName: "Postnr", type: "NUMBER" },
      { labelName: "By", type: "TEXT" },
      { labelName: "Herefter otalt som", type: "TEXT" },
      { labelName: "Land", type: "SELECT" },
    ],
  };

  const collectLabelIds = (formBlocks) => {
    return formBlocks.flatMap((block) => block.labels.map((label) => label.id));
  };

  const generateFormDataWithUniqueLabels = (formBlocks) => {
    let generatedId = 0;
    let idsArray = collectLabelIds(formBlocks);

    return formBlocks.map((block) => {
      if (block.type === "COMPANY" || block.type === "PERSON") {
        const labels = defaultLabels[block.type].map((label) => {
          // Ensure we generate a unique ID
          while (idsArray.includes(generatedId)) {
            generatedId++;
          }

          const newId = generatedId; // Use the current generatedId
          generatedId++; // Increment for the next ID

          idsArray.push(newId); // Update the idsArray with the new ID

          return {
            name: label.labelName,
            type: label.type,
            id: newId,
          };
        });

        return {
          ...block,
          labels,
        };
      }
      return block;
    });
  };

  const newBlocksForm = generateFormDataWithUniqueLabels(formBlocks);

  const totalInputs = countTotalInputs(newBlocksForm);

  // Update form errors when form blocks change
  useEffect(() => {
    const initialFormErrors = formBlocks?.flatMap((block) =>
      block?.labels?.map(() => "")
    );
    setFormErrors(initialFormErrors);
  }, [formBlocks]);

  const [virksomhedsnavn, setVirksomhedsnavn] = useState("");
  const [adresse, setAdresse] = useState("");
  const [cvrNumber, setCvrNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [herefterOtaltSom, setHerefterOtaltSom] = useState("");

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

  // ----------- CVR DATA -------------

  const [CVR, setCVR] = useState("");
  const [CVRBlockId, setCVRBlockId] = useState("");
  const [isCVRRight, setIsCVRRight] = useState(false);

  const getSVRDataHandler = async (cvr) => {
    try {
      const result = await axios.get(
        `${API}/suser/company-details/${cvr}`,
        getApiConfig()
      );

      if (result.data) {
        setVirksomhedsnavn(result.data.name || "");
        setAdresse(result.data.address || "");
        setCvrNumber(result.data.cvrNumber || "");
        setPostalCode(result.data.postalCode || "");
        setCity(result.data.city || "");
        setCountry("Danmark");
        setHerefterOtaltSom(result.data.hereafterReferredTo || "");
        console.log(result.data);
        setIsCVRRight(true);
      } else {
        clearFormFields();
        setIsCVRRight(true);
      }
    } catch (err) {
      console.log(err);
      clearFormFields();
      setIsCVRRight(true);
    }
  };

  const clearFormFields = () => {
    setVirksomhedsnavn("");
    setAdresse("");
    setPostalCode("");
    setCity("");
  };

  const handleCVRChanges = (cvr, blockId) => {
    console.log("I am here and working good");
    console.log(blockId);

    // Ensure the targeted block exists
    let targetedBlock = newBlocksForm.find((block) => block.id === blockId);
    if (!targetedBlock) return;

    console.log(targetedBlock);

    // Map field names to their corresponding variables
    const fieldMappings = {
      Virksomhedsnavn: virksomhedsnavn,
      Adresse: adresse,
      "CVR nr": cvr,
      Postnr: postalCode,
      By: city,
      Land: country,
      HerefterOtaltSom: herefterOtaltSom,
    };

    setFormData((prevFormData) => {
      let updatedFormData = [...prevFormData];

      // Iterate over fieldMappings to update, add, or remove data
      Object.entries(fieldMappings).forEach(([labelName, value]) => {
        // Find the labelId from the targetedBlock's labels
        const targetedLabel = targetedBlock.labels.find(
          (label) => label.name === labelName
        );
        const labelId = targetedLabel ? targetedLabel.id : null; // Safely retrieve labelId

        if (labelId) {
          // Proceed only if labelId is found
          const existingEntryIndex = updatedFormData.findIndex(
            (entry) => entry.blockId === blockId && entry.labelId === labelId
          );

          if (value !== "") {
            if (existingEntryIndex !== -1) {
              // Update the existing entry
              updatedFormData[existingEntryIndex].LabelValue = value;
            } else {
              // Add a new entry
              updatedFormData.push({
                blockId,
                labelId,
                LabelValue: value,
                questionText: labelName,
              });
            }
          } else {
            if (existingEntryIndex !== -1) {
              // Remove the entry if the value is an empty string
              updatedFormData.splice(existingEntryIndex, 1);
            }
          }
        }
      });

      // Directly update the form data and state
      setValue(updatedFormData, question.valueType);

      return updatedFormData;
    });
  };

  // UseEffect with the updated dependency array
  useEffect(() => {
    handleCVRChanges(CVR, CVRBlockId);
  }, [CVR, virksomhedsnavn, adresse, cvrNumber, postalCode, city]);

  // ===========  checking is all subquestions values is not null =======

  const idAllSubQuestionsValuesIsNotNull = useCallback(() => {
    // Get sub-question data
    const subQuestionData = getSubQuestionData();

    // Check if all sub-question values are not empty
    const allValuesNotEmpty = subQuestionData?.every(
      (e) => e.subQuestionValue !== ""
    );

    return allValuesNotEmpty;
  }, [getSubQuestionData]);

  useEffect(() => {
    const isDataFull = idAllSubQuestionsValuesIsNotNull();
    isSDataFull(isDataFull);
  }, [idAllSubQuestionsValuesIsNotNull, isSDataFull]);

  // =============

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

  const convertStringToAddressObject = (dataString) => {
    if (typeof dataString !== "string") {
      // If the input is not a string, return an empty object or handle it accordingly
      console.error("Expected a string but got:", typeof dataString);
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
                  value={choice.choice}
                  type="radio"
                  onChange={() => setValue(choice.choice, "checkbox")}
                  checked={value === choice.choice}
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
              style={{
                outline: "none",
                width: "100%",
                padding: "0",
                accentColor: "#ada587",
              }}
            />
          </div>
        )}

        {/* {question.valueType.startsWith("form") && (
          <div className="form_type">
            {formBlocks?.map((block) => {
             
              if (block.type === "COMPANY") {
                return (
                  <div className="company">
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
              } else if (block.type === "PERSON") {
                return (
                  <div className="person">
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

              if (!block?.labels || block?.labels.length === 0) {
                return null; 
              }

              return (
                <div className="form-block-user" key={block?.id}>
                 
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
        )} */}

        {question.valueType.startsWith("form") && (
          <div className="form_type">
            {generateFormDataWithUniqueLabels(formBlocks)?.map((block) => {
              if (block.type === "PERSON") {
                return (
                  <div
                    className="company"
                    style={{
                      backgroundColor: "rgb(255, 255, 255)",
                      padding: "2rem",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                    key={block?.id}
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
                        Virksomhed
                      </p>
                    </div>

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
                            Navn
                          </label>
                          <input
                            id="Virksomhedsnavn"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[0]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[0]?.id,
                                e.target.value,
                                block.labels[0]?.name
                              )
                            }
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[1]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[1]?.id,
                                e.target.value,
                                block.labels[1]?.name
                              )
                            }
                          />
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
                            htmlFor="cvr"
                            style={{
                              marginBottom: "1rem",
                              fontWeight: "700",
                            }}
                          >
                            CPR nr
                          </label>
                          <input
                            id="cvr"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[2]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[2]?.id,
                                e.target.value,
                                block.labels[2]?.name
                              );
                              // getSVRDataHandler(e.target.value);
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[3]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[3]?.id,
                                e.target.value,
                                block.labels[3]?.name
                              )
                            }
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[4]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[4]?.id,
                                e.target.value,
                                block.labels[4]?.name
                              )
                            }
                          />
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
                            id="name"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[5]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[5]?.id,
                                e.target.value,
                                block.labels[5]?.name
                              )
                            }
                          />
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
                          {/* <select
                            name="land"
                            id="land"
                            style={{
                              width: "100%",
                              padding: "0.8rem 1.2rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                              paddingRight: "30px",
                            }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[6]?.id
                              )?.LabelValue || "Danemark"
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[6]?.id,
                                e.target.value,
                                block.labels[6]?.name
                              )
                            }
                          >
                            <option>Land</option>
                            {countriesList.map((country) => (
                              <option
                                key={country.countryName}
                                value={country.countryName}
                              >
                                {country.countryName}
                              </option>
                            ))}
                          </select> */}

                          <select
                            name="land"
                            id="land"
                            style={{
                              width: "100%",
                              padding: "0.8rem 1.2rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                              paddingRight: "30px",
                            }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[6]?.id
                              )?.LabelValue || "" // Default value is set to an empty string
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[6]?.id,
                                e.target.value,
                                block.labels[6]?.name
                              )
                            }
                          >
                            <option value="">Land</option>{" "}
                            {/* Placeholder option */}
                            {countriesList.map((country) => (
                              <option
                                key={country.countryName}
                                value={country.countryName}
                              >
                                {country.countryName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                );
              }

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
                    key={block?.id}
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[0]?.id
                              )?.LabelValue || virksomhedsnavn
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[0]?.id,
                                e.target.value,
                                block.labels[0]?.name
                              );

                              setVirksomhedsnavn(e.target.value);
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[1]?.id
                              )?.LabelValue || adresse
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[1]?.id,
                                e.target.value,
                                block.labels[1]?.name
                              );

                              setAdresse(e.target.value);
                            }}
                          />
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
                            htmlFor="cvr"
                            style={{
                              marginBottom: "1rem",
                              fontWeight: "700",
                            }}
                          >
                            CVR nr
                          </label>
                          <input
                            id="cvr"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[2]?.id
                              )?.LabelValue || cvrNumber
                            }
                            onChange={(e) => {
                              // handleChange(
                              //   block?.id,
                              //   block.labels[2]?.id,
                              //   e.target.value,
                              //   block.labels[2]?.name
                              // );
                              setCvrNumber(e.target.value);
                              getSVRDataHandler(e.target.value);
                              setCVR(e.target.value);
                              setCVRBlockId(block?.id);
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[3]?.id
                              )?.LabelValue || postalCode
                            }
                            onChange={(e) => {
                              setPostalCode(e.target.value);
                              handleChange(
                                block?.id,
                                block.labels[3]?.id,
                                e.target.value,
                                block.labels[3]?.name
                              );
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[4]?.id
                              )?.LabelValue || city
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[4]?.id,
                                e.target.value,
                                block.labels[4]?.name
                              );

                              setCity(e.target.value);
                            }}
                          />
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
                            id="name"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[5]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[5]?.id,
                                e.target.value,
                                block.labels[5]?.name
                              )
                            }
                          />
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
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                              paddingRight: "30px",
                            }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[6]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[6]?.id,
                                e.target.value,
                                block.labels[6]?.name
                              )
                            }
                          >
                            <option value="">Land</option>{" "}
                            {countriesList.map((country) => (
                              <option
                                key={country.countryName}
                                value={country.countryName}
                              >
                                {country.countryName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div className="form-block-user" key={block?.id}>
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
          <MMapComponent
            key={question.id}
            getMapData={(value) => {
              setValue(value, "map");
            }}
            data={convertStringToAddressObject(value)}
            isFull={(value) => {
              isMapDataFullAdded(value);
            }}
          />
        )}

        {children}
      </InputContainer>
    </>
  );
};

export default DocumentSubQuestion;
