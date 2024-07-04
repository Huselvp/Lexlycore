// // this is the types controllers

// import { ReactNode, useMemo, useState, useEffect } from "react";
// import Form from "../../../ui/AuthForm";
// import { extractChoicesFromString } from "../../../utils/helpers";
// import styled from "styled-components";
// import { HiMiniChevronDown } from "react-icons/hi2";
// import { HiMiniChevronUp } from "react-icons/hi2";
// import "./styles/form.css";
// import { IoIosClose } from "react-icons/io";
// import axios from "axios";
// import { API } from "../../../utils/constants";
// import { getApiConfig } from "../../../utils/constants";
// //import Slider from "./UI/Slider";
// import { IoMdRemove } from "react-icons/io";

// const Checkbox = styled.input`
//   /* accent-color: var(--color-stone-300); */
//   /* border: none; */
//   position: relative;
//   width: 2rem;
//   height: 2rem;
//   appearance: none;
//   border-radius: 50%;

//   &:focus {
//     border-radius: 50%;
//   }
//   box-shadow: var(--shadow);
//   &::before,
//   &::after {
//     content: "";
//     position: absolute;
//     border-radius: 50%;
//   }
//   &::before {
//     background-color: var(--white);
//     top: 0;
//     left: 0;
//     width: 2rem;
//     height: 2rem;
//   }
//   &::after {
//     opacity: 0;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     background-color: var(--color-stone-600);
//     width: 1rem;
//     height: 1rem;
//   }
//   &:checked::after {
//     opacity: 1;
//   }
//   &:checked::before {
//     background-color: var(--color-stone-150);
//     border: 1px solid var(--color-stone-500);
//   }
// `;
// const Choices = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
//   & > div {
//     display: grid;
//     grid-template-columns: repeat(2, min-content);
//     grid-template-columns: min-content max-content;
//     align-items: center;
//     gap: 1rem;
//     label {
//       font-size: 1.5rem;
//       color: var(--color-grey-500);
//       font-weight: 500;
//       cursor: pointer;
//       &::first-letter {
//         text-transform: uppercase;
//       }
//     }
//   }
// `;
// // const ChoiceLabel = styled(Form.Label)`
// //   font-size: 1.4rem;
// //   color: var(--color-stone-500);
// //   color: var(--color-grey-500);
// //   font-weight: 500;
// //   &::first-letter {
// //     text-transform: uppercase;
// //   }
// // `

// const Description = styled.div`
//   /* font-size: 1.6rem; */

//   text-align: center;
//   margin-top: 0.5rem;
//   margin-bottom: 1rem;
//   color: var(--color-grey-500);
//   font-size: 1.3rem;
// `;
// const DetailsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   margin-bottom: 3rem;
//   gap: 1rem;
//   button {
//     display: flex;
//     align-items: center;
//     gap: 0.75rem;
//     color: var(--color-grey-500);
//     font-weight: 500;
//     background-color: var(--color-stone-150);
//     border: none;
//     padding: 0.6rem 1.5rem;
//     font-size: 1.3rem;
//     border-radius: var(--rounded-3xl);
//     box-shadow: var(--shadow);
//   }
// `;
// const Details = styled(Description)`
//   align-self: center;
//   display: inline-block;
//   background-color: var(--color-stone-150);
//   padding: 2rem 3rem;
//   border-radius: var(--rounded);
//   box-shadow: var(--shadow-sm);
//   color: var(--color-grey-500);
//   font-size: 1.3rem;
//   font-weight: 500;
// `;
// const InputContainer = styled.div`
//   width: 50vw;
//   align-self: center;
//   /* 900px */
//   @media screen and (max-width: 56.25em) {
//     width: 60vw;
//   }
//   /* 600px */
//   @media screen and (max-width: 37.5em) {
//     width: 75vw;
//   }
//   /* 500px */
//   @media screen and (max-width: 25em) {
//     width: 85vw;
//   }
// `;
// const Input = styled(Form.Input)`
//   padding: 0.8rem 1.2rem;
// `;
// const Textarea = styled(Form.Textarea)`
//   width: 100%;
//   min-height: 12rem;
// `;

// const DocumentQuestion = ({
//   question,
//   children,
//   value,
//   setValue,
//   isTherData,
// }: {
//   question: Question;
//   children: ReactNode;
//   setValue: (value: string) => void;
//   value: string | number;
// }) => {
//   const [showDetails, setShowDetails] = useState(false);
//   if (typeof question === "undefined") return null;
//   const choices = useMemo(
//     () => extractChoicesFromString(question!.valueType),
//     [question!.valueType]
//   );

//   const [formBlocks, setFormBlocks] = useState([]);
//   const [isAllDataIntered, setIsAllDataIntered] = useState(false);

//   useEffect(() => {
//     const get_form_blocks = async () => {
//       try {
//         await axios
//           .get(`${API}/suser/${question.id}/details`, getApiConfig())
//           .then((result) => {
//             console.log(result.data.form.blocks);
//             setFormBlocks(result.data.form.blocks);
//           });
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     get_form_blocks();
//   }, [question.id]);

//   const [formData, setFormData] = useState([]);
//   const [formErrors, setFormErrors] = useState([]);

//   const countTotalInputs = (formBlocks) => {
//     return formBlocks.reduce((total, block) => {
//       return total + block.labels.length;
//     }, 0);
//   };

//   const totalInputs = countTotalInputs(formBlocks);

//   useEffect(() => {
//     const initialFormData = formBlocks.flatMap((block) =>
//       block.labels.map((label) => ({
//         blockId: block.id,
//         labelId: label.id,
//         LabelValue: "",
//       }))
//     );

//     const initialFormErrors = initialFormData.map(() => "");

//     setFormData(initialFormData);
//     setFormErrors(initialFormErrors);
//   }, [formBlocks]);

//   // const handleChange = (blockId, labelId, labelName, value) => {
//   //   // Find the index of the item to update
//   //   const index = formData.findIndex(
//   //     (item) => item.blockId === blockId && item.labelId === labelId
//   //   );

//   //   let updatedFormData = [...formData];

//   //   if (value.trim() === "") {
//   //     // If the value is empty, remove the item from formData
//   //     if (index !== -1) {
//   //       updatedFormData.splice(index, 1);
//   //     }
//   //   } else {
//   //     const updatedItem = {
//   //       blockId: blockId,
//   //       labelId: labelId,
//   //       LabelValue: value,
//   //     };

//   //     if (index !== -1) {
//   //       // If the item exists, update it
//   //       updatedFormData[index] = updatedItem;
//   //     } else {
//   //       // If the item doesn't exist, add it
//   //       updatedFormData = [...updatedFormData, updatedItem];
//   //     }
//   //   }

//   //   setFormData(updatedFormData);

//   //   // Update formErrors
//   //   const updatedErrors = [...formErrors];
//   //   if (index !== -1) {
//   //     updatedErrors[index] =
//   //       value.trim() === "" ? `${labelName} is required` : "";
//   //   } else {
//   //     updatedErrors.push(value.trim() === "" ? `${labelName} is required` : "");
//   //   }
//   //   setFormErrors(updatedErrors);
//   // };

//   // const handleChange = (blockId, labelId, labelName, value) => {
//   //   const index = formData.findIndex(
//   //     (item) => item.blockId === blockId && item.labelId === labelId
//   //   );

//   //   let updatedFormData = [...formData];

//   //   if (value.trim() === "") {
//   //     if (index !== -1) {
//   //       updatedFormData.splice(index, 1);
//   //     }
//   //   } else {
//   //     const updatedItem = { blockId, labelId, LabelValue: value };
//   //     if (index !== -1) {
//   //       updatedFormData[index] = updatedItem;
//   //     } else {
//   //       updatedFormData = [...updatedFormData, updatedItem];
//   //     }
//   //   }

//   //   setFormData(updatedFormData);
//   //   setFormErrors(
//   //     updatedFormData.map((item) =>
//   //       item.LabelValue.trim() === "" ? `${labelName} is required` : ""
//   //     )
//   //   );

//   //   // Check if all data is entered
//   //   setIsAllDataIntered(updatedFormData.length === totalInputs);
//   //   isTherData(updatedFormData.length === totalInputs);
//   // };

//   useEffect(() => {
//     const initialFormData = formBlocks
//       .flatMap((block) =>
//         block.labels.map((label) => {
//           const value = ""; // Assuming initial values are empty strings
//           if (value.trim() === "") {
//             return null; // Do not add empty values
//           }
//           return {
//             blockId: block.id,
//             labelId: label.id,
//             LabelValue: value,
//           };
//         })
//       )
//       .filter((item) => item !== null); // Filter out null values

//     const initialFormErrors = initialFormData.map(() => "");

//     setFormData(initialFormData);
//     setFormErrors(initialFormErrors);
//   }, [formBlocks]);

//   // useEffect(() => {
//   //   if (totalInputs === formData.length) {
//   //     setIsAllDataIntered(true);
//   //   } else {
//   //     setIsAllDataIntered(false);
//   //   }
//   // }, [totalInputs, formData]);

//   return (
//     <>
//       <div>
//         <h2>{question.questionText}</h2>
//         <Description>{question.description}</Description>
//       </div>
//       <DetailsContainer>
//         <button onClick={() => setShowDetails((show) => !show)}>
//           <span>{showDetails ? "Hide " : "Show"} details</span>
//           {showDetails ? <HiMiniChevronUp /> : <HiMiniChevronDown />}
//         </button>
//         {showDetails && <Details>{question.descriptionDetails}</Details>}
//       </DetailsContainer>
//       <InputContainer>
//         {question.valueType === "number" && (
//           <Input
//             placeholder={question.questionText}
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             type="number"
//           />
//         )}
//         {question.valueType === "input" && (
//           <Input
//             placeholder={question.questionText}
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             type="text"
//           />
//         )}
//         {question.valueType === "textarea" && (
//           <Textarea
//             placeholder={question.questionText}
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//           />
//         )}
//         {question.valueType.startsWith("checkbox") && (
//           <Choices>
//             {choices.map((choice) => (
//               <div key={choice.id}>
//                 <Checkbox
//                   name="choice"
//                   id={choice.choice}
//                   value={choice.newRelatedText}
//                   type="radio"
//                   onChange={() => setValue(choice.newRelatedText)}
//                   checked={value === choice.newRelatedText}
//                 />
//                 <label htmlFor={choice.choice}>{choice.choice}</label>
//               </div>
//             ))}
//           </Choices>
//         )}

//         {question.valueType.startsWith("form") && (
//           <div className="form_type">
//             {formBlocks.map((block, blockIndex) => {
//               return (
//                 <div className="form-block-user" key={block.id}>
//                   <IoIosClose className="form_type_controllers" size={20} />

//                   {block.labels.map((label, labelIndex) => {
//                     const fieldName = label.name;
//                     const index = blockIndex * block.labels.length + labelIndex;

//                     const handleInputChange = (e) => {
//                       const { value } = e.target;
//                       handleChange(block.id, label.id, fieldName, value, index);
//                     };

//                     return (
//                       <div
//                         key={label.id}
//                         className="block-input"
//                         onChange={() => {
//                           setValue(formData);
//                           isTherData(isAllDataIntered);
//                         }}
//                       >
//                         <label>{label.name}</label>
//                         {label.type === "SELECT" ? (
//                           <select
//                             name={label.name}
//                             onChange={handleInputChange}
//                           >
//                             <option value="">Select an option</option>
//                             {Object.keys(label.options).map((key) => (
//                               <option key={key} value={key}>
//                                 {label.options[key]}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <input
//                             type={label.type}
//                             name={label.name}
//                             placeholder={label.name}
//                             onChange={handleInputChange}
//                           />
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <button
//           onClick={() => {
//             console.log(isAllDataIntered, "fuck you");
//           }}
//         >
//           test
//         </button>

//         {children}
//       </InputContainer>
//     </>
//   );
// };

// export default DocumentQuestion;

import { ReactNode, useMemo, useState, useEffect, useCallback } from "react";
import Form from "../../../ui/AuthForm";
import { extractChoicesFromString } from "../../../utils/helpers";
import styled from "styled-components";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import { API } from "../../../utils/constants";
import { getApiConfig } from "../../../utils/constants";
import "./styles/form.css";
import { IoMdRemove } from "react-icons/io";
import Slider from "./UI/Slider";

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

const DocumentQuestion = ({
  question,
  children,
  value,
  setValue,
  isTherData,
}: {
  question: Question;
  children: ReactNode;
  setValue: (value: string) => void;
  value: string | number;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  if (typeof question === "undefined") return null;
  const choices = useMemo(
    () => extractChoicesFromString(question!.valueType),
    [question!.valueType]
  );

  const [formBlocks, setFormBlocks] = useState([]);
  const [isAllDataIntered, setIsAllDataIntered] = useState(false);

  useEffect(() => {
    const get_form_blocks = async () => {
      try {
        await axios
          .get(`${API}/suser/question-details/${question.id}`, getApiConfig())
          .then((result) => {
            console.log(result.data.form.blocks);
            setFormBlocks(result.data.form.blocks);
          });
      } catch (err) {
        console.log(err);
      }
    };

    get_form_blocks();
  }, [question.id]);

  const [formData, setFormData] = useState([]);
  const [formErrors, setFormErrors] = useState([]);

  const countTotalInputs = (formBlocks) => {
    return formBlocks.reduce((total, block) => {
      return total + block.labels.length;
    }, 0);
  };

  const totalInputs = countTotalInputs(formBlocks);

  useEffect(() => {
    const initialFormData = formBlocks.flatMap((block) =>
      block.labels.map((label) => ({
        blockId: block.id,
        labelId: label.id,
        LabelValue: "",
      }))
    );

    const initialFormErrors = initialFormData.map(() => "");

    setFormData(initialFormData);
    setFormErrors(initialFormErrors);
  }, [formBlocks]);

  const handleChange = useCallback(
    (blockId, labelId, labelName, value) => {
      const index = formData.findIndex(
        (item) => item.blockId === blockId && item.labelId === labelId
      );

      let updatedFormData = [...formData];

      if (value.trim() === "") {
        if (index !== -1) {
          updatedFormData.splice(index, 1);
        }
      } else {
        const updatedItem = { blockId, labelId, LabelValue: value };
        if (index !== -1) {
          updatedFormData[index] = updatedItem;
        } else {
          updatedFormData = [...updatedFormData, updatedItem];
        }
      }

      setFormData(updatedFormData);
      setFormErrors(
        updatedFormData.map((item) =>
          item.LabelValue.trim() === "" ? `${labelName} is required` : ""
        )
      );

      setIsAllDataIntered(updatedFormData.length === totalInputs);
      isTherData(updatedFormData.length === totalInputs);
    },
    [formData, formErrors, isTherData, totalInputs]
  );

  useEffect(() => {
    isTherData(isAllDataIntered);
  }, [isAllDataIntered, isTherData]);

  return (
    <>
      <div>
        <h2>{question.questionText}</h2>
        <Description>{question.description}</Description>
      </div>
      <DetailsContainer>
        <button onClick={() => setShowDetails((show) => !show)}>
          <span>{showDetails ? "Hide " : "Show"} details</span>
          {showDetails ? <HiMiniChevronUp /> : <HiMiniChevronDown />}
        </button>
        {showDetails && <Details>{question.descriptionDetails}</Details>}
      </DetailsContainer>
      <InputContainer>
        {question.valueType === "number" && (
          <Input
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
          />
        )}
        {question.valueType === "input" && (
          <Input
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
        )}
        {question.valueType === "textarea" && (
          <Textarea
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
                          isTherData(isAllDataIntered);
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
          // <Slider minV={question.filterStart} maxV={question.filterEnd} />

          <div className="range-container">
            <input
              type="range"
              name="range"
              id="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="range">{value}</label>
          </div>
        )}

        {children}
      </InputContainer>
    </>
  );
};

export default DocumentQuestion;
