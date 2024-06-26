// "use client";
// import React, { useState } from "react";
// import "../styles/wizard.css";

// const Wizard: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [responses, setResponses] = useState({});

//   const steps = [
//     {
//       step: 1,
//       title: "Welcome to [Lawyer Platform Name]",
//       subtitle: "Let's get started with some basic information",
//       fields: [
//         { label: "Full Name", type: "text_input" },
//         { label: "Email Address", type: "text_input" },
//         { label: "Phone Number", type: "text_input" },
//       ],
//       subquestions: [
//         {
//           label: "Preferred Contact Method",
//           type: "dropdown",
//           options: ["Email", "Phone", "SMS"],
//         },
//         {
//           label: "Best Time to Contact",
//           type: "dropdown",
//           options: ["Morning", "Afternoon", "Evening"],
//         },
//       ],
//       buttons: ["Next"],
//     },
//     {
//       step: 2,
//       title: "Tell Us About Your Case",
//       fields: [
//         {
//           label: "Case Type",
//           type: "dropdown",
//           options: ["Criminal", "Civil", "Family", "Corporate", "etc."],
//         },
//         { label: "Case Description", type: "textarea" },
//         { label: "Date of Incident", type: "date_picker" },
//         { label: "Location of Incident", type: "text_input" },
//       ],
//       buttons: ["Back", "Next"],
//     },
//     {
//       step: 3,
//       title: "Personal Information",
//       fields: [
//         { label: "Date of Birth", type: "date_picker" },
//         { label: "Address", type: "text_input" },
//         { label: "City", type: "text_input" },
//         {
//           label: "State",
//           type: "dropdown",
//           options: ["State 1", "State 2", "State 3", "etc."],
//         },
//         { label: "ZIP Code", type: "text_input" },
//       ],
//       subquestions: [
//         { label: "Country of Citizenship", type: "text_input" },
//         {
//           label: "Marital Status",
//           type: "dropdown",
//           options: ["Single", "Married", "Divorced", "Widowed"],
//         },
//       ],
//       buttons: ["Back", "Next"],
//     },
//     {
//       step: 4,
//       title: "Additional Information",
//       fields: [
//         {
//           label: "Are there any witnesses?",
//           type: "radio_buttons",
//           options: ["Yes", "No"],
//         },
//         {
//           label: "Any previous legal actions related to this case?",
//           type: "radio_buttons",
//           options: ["Yes", "No"],
//         },
//       ],
//       buttons: ["Back", "Next"],
//     },
//     {
//       step: 5,
//       title: "Document Upload",
//       fields: [
//         {
//           label: "Document Upload",
//           type: "file_upload",
//           accepted_types: ["PDF", "DOC", "JPG", "PNG"],
//         },
//       ],
//       buttons: ["Back", "Next"],
//     },
//     {
//       step: 6,
//       title: "Review Your Information",
//       fields:
//         "Display all the information entered in previous steps in a read-only format",
//       buttons: ["Back", "Submit"],
//     },
//     {
//       step: 7,
//       title: "Thank You!",
//       message:
//         "Your information has been successfully submitted. We will review your case and get back to you shortly.",
//       buttons: ["Finish"],
//     },
//   ];

//   const handleNext = () => {
//     setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
//   };

//   const handleBack = () => {
//     setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
//   };

//   const handleStepClick = (index: number) => {
//     setCurrentStep(index);
//   };

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setResponses((prevResponses) => ({ ...prevResponses, [name]: value }));
//   };

//   const handleDropdownChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const { name, value } = event.target;
//     setResponses((prevResponses) => ({ ...prevResponses, [name]: value }));
//   };

//   const renderFields = (fields: any[]) => {
//     return fields.map((field, index) => {
//       switch (field.type) {
//         case "text_input":
//           return (
//             <div key={index} className="text_input_container">
//               <label>{field.label}:</label>
//               <input
//                 className="text_input"
//                 placeholder={`Enter your ${field.label}`}
//                 type="text"
//                 name={field.label}
//                 onChange={handleInputChange}
//               />
//             </div>
//           );
//         case "dropdown":
//           return (
//             <div key={index} className="dropdown_container">
//               <label>{field.label}:</label>
//               <select name={field.label} onChange={handleDropdownChange}>
//                 {field.options &&
//                   field.options.map((option: string, index: number) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           );
//         case "textarea":
//           return (
//             <div key={index} className="textarea_container">
//               <label>{field.label}:</label>
//               <textarea
//                 placeholder={`Enter your ${field.label}`}
//                 name={field.label}
//                 onChange={handleInputChange}
//               ></textarea>
//             </div>
//           );
//         case "date_picker":
//           return (
//             <div key={index} className="date_picker_container">
//               <label>{field.label}:</label>
//               <input
//                 type="date"
//                 name={field.label}
//                 onChange={handleInputChange}
//               />
//             </div>
//           );
//         case "radio_buttons":
//           return (
//             <div key={index} className="radio_container">
//               <label className="radio_title">{field.label}:</label>
//               {field.options &&
//                 field.options.map((option: string, index: number) => (
//                   <div key={index} className="radio">
//                     <input
//                       type="radio"
//                       id={option}
//                       name={field.label}
//                       value={option}
//                       onChange={handleInputChange}
//                     />
//                     <label htmlFor={option}>{option}</label>
//                   </div>
//                 ))}
//             </div>
//           );
//         case "file_upload":
//           return (
//             <div key={index} className="file_upload">
//               <label>{field.label}:</label>
//               <input
//                 type="file"
//                 name={field.label}
//                 accept={field.accepted_types?.join(", ")}
//                 onChange={handleInputChange}
//               />
//             </div>
//           );
//         default:
//           return null;
//       }
//     });
//   };

//   const renderSubquestions = (subquestions: any[]) => {
//     return subquestions.map((subquestion, index) => {
//       switch (subquestion.type) {
//         case "text_input":
//           return (
//             <div key={index} className="text_input_container">
//               <label>{subquestion.label}:</label>
//               <input
//                 className="text_input"
//                 placeholder={`Enter your ${subquestion.label}`}
//                 type="text"
//                 name={subquestion.label}
//                 onChange={handleInputChange}
//               />
//             </div>
//           );
//         case "dropdown":
//           return (
//             <div key={index} className="dropdown_container">
//               <label>{subquestion.label}:</label>
//               <select name={subquestion.label} onChange={handleDropdownChange}>
//                 {subquestion.options &&
//                   subquestion.options.map((option: string, index: number) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           );
//         case "textarea":
//           return (
//             <div key={index} className="textarea_container">
//               <label>{subquestion.label}:</label>
//               <textarea
//                 placeholder={`Enter your ${subquestion.label}`}
//                 name={subquestion.label}
//                 onChange={handleInputChange}
//               ></textarea>
//             </div>
//           );
//         case "date_picker":
//           return (
//             <div key={index} className="date_picker_container">
//               <label>{subquestion.label}:</label>
//               <input
//                 type="date"
//                 name={subquestion.label}
//                 onChange={handleInputChange}
//               />
//             </div>
//           );
//         case "radio_buttons":
//           return (
//             <div key={index} className="radio_container">
//               <label className="radio_title">{subquestion.label}:</label>
//               {subquestion.options &&
//                 subquestion.options.map((option: string, index: number) => (
//                   <div key={index} className="radio">
//                     <input
//                       type="radio"
//                       id={option}
//                       name={subquestion.label}
//                       value={option}
//                       onChange={handleInputChange}
//                     />
//                     <label htmlFor={option}>{option}</label>
//                   </div>
//                 ))}
//             </div>
//           );
//         case "file_upload":
//           return (
//             <div key={index} className="file_upload">
//               <label>{subquestion.label}:</label>
//               <input
//                 type="file"
//                 name={subquestion.label}
//                 accept={subquestion.accepted_types?.join(", ")}
//                 onChange={handleInputChange}
//               />
//             </div>
//           );
//         default:
//           return null;
//       }
//     });
//   };

//   if (currentStep >= steps.length) {
//     return <div>Thank you! Your form has been submitted.</div>;
//   }

//   const currentStepData = steps[currentStep];

//   return (
//     <div className="container">
//       <div className="form-container">
//         {/* her is the slider */}
//         <div className="wizard-slider">
//           {steps.map((step, index) => (
//             <div
//               key={index}
//               className="wizard-main-icon-container"
//               onClick={() => handleStepClick(index)}
//             >
//               <div
//                 className={`wizard-main-icon-circle-line ${
//                   index < currentStep ? "active" : ""
//                 }`}
//               ></div>
//               <div
//                 className={`wizard-main-icon-circle ${
//                   index < currentStep ? "active" : ""
//                 }`}
//               ></div>
//               {step.subquestions && (
//                 <div className="wizard-sub-circle-container">
//                   <div
//                     className={`wizard-sub-circle-line ${
//                       index < currentStep ? "active" : ""
//                     }`}
//                   ></div>
//                   <div
//                     className={`wizard-sub-icon-circle ${
//                       index < currentStep ? "active" : ""
//                     }`}
//                   ></div>
//                   {index < steps.length - 1 && (
//                     <div
//                       className={`wizard-sub-circle-line ${
//                         index < currentStep - 1 ? "active" : ""
//                       }`}
//                     ></div>
//                   )}
//                 </div>
//               )}
//               {index < steps.length - 1 && (
//                 <div
//                   className={`wizard-main-icon-circle-line ${
//                     index < currentStep - 1 ? "active" : ""
//                   }`}
//                 ></div>
//               )}
//             </div>
//           ))}
//         </div>
//         {/* her is the data displayed */}
//         <React.Fragment>
//           <div className="wizard_form_container">
//             <h2 className="title">{currentStepData.title}</h2>
//             {currentStepData.subtitle && (
//               <p className="sub_title">{currentStepData.subtitle}</p>
//             )}
//             {renderFields(currentStepData.fields)}
//             {currentStepData.subquestions && (
//               <div>
//                 <h3>Additional Information</h3>
//                 {renderSubquestions(currentStepData.subquestions)}
//               </div>
//             )}
//             <div className="btns_container">
//               {currentStep > 0 && (
//                 <button className="btn" onClick={handleBack}>
//                   Back
//                 </button>
//               )}
//               <button className="btn" onClick={handleNext}>
//                 {currentStep === steps.length - 1 ? "Submit" : "Next"}
//               </button>
//             </div>
//           </div>
//         </React.Fragment>
//       </div>
//     </div>
//   );
// };

// export default Wizard;

// const steps = [
//   {
//     step: 1,
//     title: "Welcome to [Lawyer Platform Name]",
//     subtitle: "Let's get started with some basic information",
//     fields: [
//       { label: "Full Name", type: "text_input" },
//       { label: "Email Address", type: "text_input" },
//       { label: "Phone Number", type: "text_input" },
//     ],
//     subquestions: [
//       {
//         label: "Preferred Contact Method",
//         type: "dropdown",
//         options: ["Email", "Phone", "SMS"],
//       },
//       {
//         label: "Best Time to Contact",
//         type: "dropdown",
//         options: ["Morning", "Afternoon", "Evening"],
//       },
//     ],
//     buttons: ["Next"],
//   },
//   {
//     step: 2,
//     title: "Tell Us About Your Case",
//     fields: [
//       {
//         label: "Case Type",
//         type: "dropdown",
//         options: ["Criminal", "Civil", "Family", "Corporate", "etc."],
//       },
//       { label: "Case Description", type: "textarea" },
//       { label: "Date of Incident", type: "date_picker" },
//       { label: "Location of Incident", type: "text_input" },
//     ],
//     buttons: ["Back", "Next"],
//   },
//   {
//     step: 3,
//     title: "Personal Information",
//     fields: [
//       { label: "Date of Birth", type: "date_picker" },
//       { label: "Address", type: "text_input" },
//       { label: "City", type: "text_input" },
//       {
//         label: "State",
//         type: "dropdown",
//         options: ["State 1", "State 2", "State 3", "etc."],
//       },
//       { label: "ZIP Code", type: "text_input" },
//     ],
//     subquestions: [
//       { label: "Country of Citizenship", type: "text_input" },
//       {
//         label: "Marital Status",
//         type: "dropdown",
//         options: ["Single", "Married", "Divorced", "Widowed"],
//       },
//     ],
//     buttons: ["Back", "Next"],
//   },
//   {
//     step: 4,
//     title: "Additional Information",
//     fields: [
//       {
//         label: "Are there any witnesses?",
//         type: "radio_buttons",
//         options: ["Yes", "No"],
//       },
//       {
//         label: "Any previous legal actions related to this case?",
//         type: "radio_buttons",
//         options: ["Yes", "No"],
//       },
//     ],
//     buttons: ["Back", "Next"],
//   },
//   {
//     step: 5,
//     title: "Document Upload",
//     fields: [
//       {
//         label: "Document Upload",
//         type: "file_upload",
//         accepted_types: ["PDF", "DOC", "JPG", "PNG"],
//       },
//     ],
//     buttons: ["Back", "Next"],
//   },
//   {
//     step: 6,
//     title: "Review Your Information",
//     fields:
//       "Display all the information entered in previous steps in a read-only format",
//     buttons: ["Back", "Submit"],
//   },
//   {
//     step: 7,
//     title: "Thank You!",
//     message:
//       "Your information has been successfully submitted. We will review your case and get back to you shortly.",
//     buttons: ["Finish"],
//   },
// ];

// const renderFields = (fields: any[]) => {
//   return fields.map((field, index) => {
//     switch (field.type) {
//       case "text_input":
//         return (
//           <div key={index} className="text_input_container">
//             <label>{field.label}:</label>
//             <input
//               className="text_input"
//               placeholder={`Enter your ${field.label}`}
//               type="text"
//               name={field.label}
//               onChange={handleInputChange}
//             />
//           </div>
//         );
//       case "dropdown":
//         return (
//           <div key={index} className="dropdown_container">
//             <label>{field.label}:</label>
//             <select name={field.label} onChange={handleDropdownChange}>
//               {field.options &&
//                 field.options.map((option: string, index: number) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//             </select>
//           </div>
//         );
//       case "textarea":
//         return (
//           <div key={index} className="textarea_container">
//             <label>{field.label}:</label>
//             <textarea
//               placeholder={`Enter your ${field.label}`}
//               name={field.label}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>
//         );
//       case "date_picker":
//         return (
//           <div key={index} className="date_picker_container">
//             <label>{field.label}:</label>
//             <input
//               type="date"
//               name={field.label}
//               onChange={handleInputChange}
//             />
//           </div>
//         );
//       case "radio_buttons":
//         return (
//           <div key={index} className="radio_container">
//             <label className="radio_title">{field.label}:</label>
//             {field.options &&
//               field.options.map((option: string, index: number) => (
//                 <div key={index} className="radio">
//                   <input
//                     type="radio"
//                     id={option}
//                     name={field.label}
//                     value={option}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor={option}>{option}</label>
//                 </div>
//               ))}
//           </div>
//         );
//       case "file_upload":
//         return (
//           <div key={index} className="file_upload">
//             <label>{field.label}:</label>
//             <input
//               type="file"
//               name={field.label}
//               accept={field.accepted_types?.join(", ")}
//               onChange={handleInputChange}
//             />
//           </div>
//         );
//       default:
//         return null;
//     }
//   });
// };

// const renderSubquestions = (subquestions: any[]) => {
//   return subquestions.map((subquestion, index) => {
//     switch (subquestion.type) {
//       case "text_input":
//         return (
//           <div key={index} className="text_input_container">
//             <label>{subquestion.label}:</label>
//             <input
//               className="text_input"
//               placeholder={`Enter your ${subquestion.label}`}
//               type="text"
//               name={subquestion.label}
//               onChange={handleInputChange}
//             />
//           </div>
//         );
//       case "dropdown":
//         return (
//           <div key={index} className="dropdown_container">
//             <label>{subquestion.label}:</label>
//             <select name={subquestion.label} onChange={handleDropdownChange}>
//               {subquestion.options &&
//                 subquestion.options.map((option: string, index: number) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//             </select>
//           </div>
//         );
//       case "textarea":
//         return (
//           <div key={index} className="textarea_container">
//             <label>{subquestion.label}:</label>
//             <textarea
//               placeholder={`Enter your ${subquestion.label}`}
//               name={subquestion.label}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>
//         );
//       case "date_picker":
//         return (
//           <div key={index} className="date_picker_container">
//             <label>{subquestion.label}:</label>
//             <input
//               type="date"
//               name={subquestion.label}
//               onChange={handleInputChange}
//             />
//           </div>
//         );
//       case "radio_buttons":
//         return (
//           <div key={index} className="radio_container">
//             <label className="radio_title">{subquestion.label}:</label>
//             {subquestion.options &&
//               subquestion.options.map((option: string, index: number) => (
//                 <div key={index} className="radio">
//                   <input
//                     type="radio"
//                     id={option}
//                     name={subquestion.label}
//                     value={option}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor={option}>{option}</label>
//                 </div>
//               ))}
//           </div>
//         );
//       case "file_upload":
//         return (
//           <div key={index} className="file_upload">
//             <label>{subquestion.label}:</label>
//             <input
//               type="file"
//               name={subquestion.label}
//               accept={subquestion.accepted_types?.join(", ")}
//               onChange={handleInputChange}
//             />
//           </div>
//         );
//       default:
//         return null;
//     }
//   });
// };
