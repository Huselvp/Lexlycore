// import { useEffect, useState } from "react";
// import "./styles/addFormStyles.css";
// import { getApiConfig } from "../../utils/constants";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { IoMdClose } from "react-icons/io";

// import Block from "./Block";
// import PopUpContainer from "./components/pop_up_container/PopUpContainer";

// function FormBlocs() {
//   const [blocs, setBlocs] = useState([]);

//   const [blocInputLabel, setBlocInputLabel] = useState("");
//   const [blocInputType, setBlocInputType] = useState("");

//   const [isPopUpOpen, setIsPopUpOpen] = useState(false);

//   const [isAddInputsOpen, setIsAddInputsOpen] = useState(false);

//   const [isEditChoiceOpen, setIsEditChoiceOpen] = useState(false);

//   const { blocId } = useParams<{ templateId: string }>();

//   const [blocFormId, setBlocFormId] = useState(0);

//   const addNewBlocHandler = async () => {
//     try {
//       await axios
//         .post(
//           `http://localhost:8081/api/form/block/${blocId}`,
//           {
//             name: "tesr",
//           },
//           getApiConfig()
//         )
//         .then((result) => {
//           setBlocs((prevBlocs) => [...prevBlocs, result.data]);
//           getFormBlocs(blocId);
//           console.log(result.data);
//         });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getFormBlocs = async (id) => {
//     try {
//       await axios
//         .get(`http://localhost:8081/api/form/blocks/${id}`, getApiConfig())
//         .then((result) => {
//           setBlocs(result.data);
//         });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     getFormBlocs(blocId);
//   }, [blocId]);

//   const add_input_handler = (id) => {
//     setIsAddInputsOpen(true);

//     setIsPopUpOpen(true);

//     setIsEditChoiceOpen(false);

//     setBlocFormId(id);
//   };

//   const submit_edit_choice = () => {
//     setIsAddInputsOpen(false);

//     setIsEditChoiceOpen(false);
//   };

//   const add_input = async () => {
//     try {
//       console.log(blocFormId);
//       await axios
//         .post(
//           `http://localhost:8081/api/form/block/label/${blocFormId}`,
//           { name: blocInputLabel, type: blocInputType },
//           getApiConfig()
//         )
//         .then((result) => {
//           console.log(result);
//           setIsPopUpOpen(false);
//           setBlocInputLabel("");
//           setBlocInputType("");
//           // getFormBlocs(blocId);
//         });
//     } catch (err) {
//       console.error("Error adding input:", err);
//     }
//   };

//   const create_new_input_handler = async () => {
//     if (blocInputLabel !== "" && blocInputType !== "") {
//       switch (blocInputType) {
//         case "TEXT":
//         case "NUMBER":
//         case "DATE":
//         case "SELECT":
//           await add_input();

//           break;
//         default:
//           console.warn(`Unhandled input type: ${blocInputType}`);
//           break;
//       }
//     }
//   };

//   return (
//     <div className="container">
//       <div className="blocs-container">
//         {blocs.map((bloc) => (
//           <Block
//             id={bloc.id}
//             onAddInputs={() => {
//               add_input_handler(bloc.id);
//             }}
//             // onReloadBlocks={() => {
//             //   getFormBlocs(blocId);
//             // }}
//             formId={blocId}
//           />
//         ))}

//         <div className="add-new-bloc">
//           <button onClick={addNewBlocHandler}>Add new bloc</button>
//         </div>
//       </div>

//       <PopUpContainer isOpen={isPopUpOpen}>
//         {isAddInputsOpen && (
//           <div className="add-inputs-container">
//             <IoMdClose
//               className="close-btn"
//               onClick={() => {
//                 setIsPopUpOpen(false);
//               }}
//             />
//             <form>
//               <label htmlFor="inputName">Input name</label>
//               <input
//                 name="inputName"
//                 onChange={(e) => {
//                   setBlocInputLabel(e.target.value);
//                 }}
//                 placeholder="Enter the input name"
//                 type="text"
//               ></input>
//               <label htmlFor="inputType">Input type</label>
//               <select
//                 name="inputType"
//                 onChange={(e) => {
//                   setBlocInputType(e.target.value);
//                 }}
//               >
//                 <option value="TEXT">Text</option>
//                 <option value="NUMBER">Number</option>
//                 <option value="checkbox">Checkbox</option>
//                 <option value="DATE">Date</option>
//                 <option value="SELECT">Select</option>
//               </select>
//               <button
//                 type="button"
//                 onClick={() => {
//                   create_new_input_handler();
//                 }}
//               >
//                 Add
//               </button>
//             </form>
//           </div>
//         )}

//         {isEditChoiceOpen && (
//           <div className="edit-choice-container">
//             <label>Edit choice</label>
//             <input
//               type="text"
//               placeholder="here I should put the value of the choice"
//             ></input>
//             <button type="button" onClick={submit_edit_choice}>
//               Edit
//             </button>
//           </div>
//         )}
//       </PopUpContainer>
//     </div>
//   );
// }

// export default FormBlocs;
