// import React, { useState, useEffect } from "react";
// import { getApiConfig } from "../../utils/constants";
// import axios from "axios";
// import "./styles/addFormStyles.css";
// import { FiMoreVertical } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { CiEdit } from "react-icons/ci";
// import { IoDuplicateOutline } from "react-icons/io5";
// import { IoMdClose } from "react-icons/io";

// import Select from "./components/Select";

// import PopUpContainer from "./components/pop_up_container/PopUpContainer";

// function Block(props) {
//   const [blockData, setBlockData] = useState([]);
//   const [isControllersOpen, setIsControllersOpen] = useState(false);
//   const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);

//   const [isPopUpOpen, setIsPopUpOpen] = useState(false);

//   const [selectedInputData, setSelectedInputData] = useState({});

//   const [selectedInputName, setSelectedInputName] = useState("");
//   const [selectedInputType, setSelctedInputType] = useState("");

//   const getBlockData = async (id) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/form/block/label/${id}`,
//         getApiConfig()
//       );

//       setBlockData(response.data);

//       console.log(response.data, "from block");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     getBlockData(props.id);
//   }, [props.id]);

//   const handleAddInputClick = async (id) => {
//     await props.onAddInputs(id);
//     await getBlockData(id);
//   };

//   const delete_block_handler = async () => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:8081/api/form/block/${props.formId}/${props.id}`,
//         getApiConfig()
//       );

//       console.log(response);
//     } catch (err) {
//       console.log(err);
//     }

//     console.log(props.id);
//   };

//   const duplicate_block_handler = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:8081/api/form/block/duplicate/${props.formId}/${props.id}`,
//         {},
//         getApiConfig()
//       );

//       console.log(response);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const edit_input_handler_data = async (blockId, inputId) => {
//     try {
//       await axios
//         .get(
//           `http://localhost:8081/api/form/block/label/${blockId}/${inputId}`,
//           getApiConfig()
//         )
//         .then((result) => {
//           console.log(result.data, "edit input");
//           setSelectedInputData(result.data);
//           setSelectedInputName(result.data.name);
//           setSelctedInputType(result.data.type);
//         });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const delete_input_handler = async (blockId, inputId) => {
//     try {
//       await axios
//         .delete(
//           `http://localhost:8081/api/form/block/label/${blockId}/${inputId}`,
//           getApiConfig()
//         )
//         .then((result) => {
//           console.log(result.data, "edit input");
//           setIsPopUpOpen(false);
//         });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const update_input_handler = async (blockId, inputId) => {
//     try {
//       if (selectedInputName !== "" && selectedInputType !== "") {
//         await axios
//           .put(
//             `http://localhost:8081/api/form/block/label/${blockId}/${inputId}`,
//             { name: selectedInputName, type: selectedInputType, id: inputId },
//             getApiConfig()
//           )
//           .then((result) => {
//             console.log(result.data, "edit input");
//             setIsPopUpOpen(false);
//           });
//       }
//     } catch (err) {
//       console.log(err);
//     }

//     console.log(blockId, inputId);
//   };

//   const handeling_input_type = (ex: string, label: string, id) => {
//     switch (ex) {
//       case "TEXT":
//       case "NUMBER":
//       case "DATE":
//         return (
//           <form>
//             <label>
//               {label}
//               <span>
//                 <CiEdit
//                   color="black"
//                   onClick={() => {
//                     setIsPopUpOpen(true);
//                     edit_input_handler_data(props.id, id);
//                   }}
//                 />
//               </span>
//             </label>
//             <input type={ex}></input>
//           </form>
//         );
//         break;
//       case "SELECT":
//         return <Select blockId={props.id} id={id} label={label} />;
//         break;
//     }
//   };

//   return (
//     <React.Fragment>
//       <div className="bloc-inputs">
//         {Array.isArray(blockData) &&
//           blockData.length > 0 &&
//           blockData.map((input, index) => (
//             <React.Fragment key={index}>
//               {handeling_input_type(input.type, input.name, input.id)}
//             </React.Fragment>
//           ))}

//         <button
//           onClick={() => {
//             handleAddInputClick(props.id);
//           }}
//         >
//           Add new input
//         </button>

//         {blockData.length !== 0 && (
//           <FiMoreVertical
//             className="block-controllers"
//             onClick={() => {
//               setIsControllersOpen((prev) => !prev);
//             }}
//           />
//         )}

//         <div
//           className={
//             isControllersOpen === true
//               ? "bloc-inputs-controllers active"
//               : "bloc-inputs-controllers"
//           }
//         >
//           <ul>
//             <li onClick={delete_block_handler}>
//               <RiDeleteBin6Line /> <span>Delete</span>
//             </li>

//             <li onClick={duplicate_block_handler}>
//               <IoDuplicateOutline /> <span>Duplicate</span>
//             </li>
//           </ul>
//         </div>

//         <div
//           className={
//             isEditBlockOpen === true
//               ? "edit-block-container active"
//               : "edit-block-container"
//           }
//         >
//           <div className="edit-block-settings">
//             {blockData.length !== 0 &&
//               blockData.map((input) => (
//                 <form>
//                   <label>{input.name}</label>
//                   <input type={input.type}></input>
//                 </form>
//               ))}

//             <IoMdClose
//               className="close-btn"
//               onClick={() => {
//                 setIsEditBlockOpen(false);
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       <PopUpContainer isOpen={isPopUpOpen}>
//         <div className="add-inputs-container">
//           <IoMdClose
//             className="close-btn"
//             onClick={() => {
//               setIsPopUpOpen(false);
//             }}
//           />
//           {Object.keys(selectedInputData).length !== 0 && (
//             <form>
//               <label>Input Name</label>
//               <input
//                 value={selectedInputName}
//                 onChange={(e) => {
//                   setSelectedInputName(e.target.value);
//                 }}
//               ></input>

//               <label htmlFor="inputType">Input type</label>
//               <select
//                 name="inputType"
//                 value={selectedInputType}
//                 onChange={(e) => {
//                   setSelctedInputType(e.target.value);
//                 }}
//               >
//                 <option value="TEXT">Text</option>
//                 <option value="NUMBER">Number</option>
//                 <option value="DATE">Date</option>
//                 <option value="SELECT">Select</option>
//               </select>
//             </form>
//           )}

//           <div className="btns">
//             <button
//               type="button"
//               className="delete"
//               onClick={() => {
//                 delete_input_handler(props.id, selectedInputData.id);

//                 console.log(selectedInputData);
//               }}
//             >
//               Delete
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setIsPopUpOpen(false);
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 update_input_handler(props.id, selectedInputData.id);
//               }}
//             >
//               Done
//             </button>
//           </div>
//         </div>
//       </PopUpContainer>
//     </React.Fragment>
//   );
// }

// export default Block;
