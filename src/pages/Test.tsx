const Test = () => {
  return (
    <div>
      <input
        type="number"
        onChange={(e) => console.log(typeof e.target.value)}
      />
    </div>
  )
}

export default Test
// ************************
// import axios from "axios"

// const Test = () => {
//   const documentId = 7
//   const templateId = 31
//   const token =
//     "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbWlyYSB1IiwiaWF0IjoxNzA0MzcyNTg1LCJleHAiOjE3MDQ0NTg5ODV9.YK6P0YX6VZ5M2E0HNr5rAMJXAifRnkrZLRnjOcIG3Nk"
//   const API = `http://localhost:8081/api/suser/generate-pdf/${documentId}/${templateId}`

//   const onClick = async () => {
//     const response = await axios.get(API, {
//       headers: {
//         Authorization: "Bearer " + token,
//         "Content-Type": "application/json"
//       },
//       responseType: "blob", // Important for handling binary data
//       withCredentials: true
//     })
//     console.log(response)

//     // Create a blob from the response data
//     const blob = new Blob([response.data], { type: "application/pdf" })

//     // Create a URL for the blob
//     const url = URL.createObjectURL(blob)

//     // Create an anchor element to trigger the download
//     const link = document.createElement("a")
//     link.href = url
//     link.download = "document.pdf"
//     document.body.appendChild(link)

//     // Trigger the download
//     link.click()

//     // Remove the anchor element
//     document.body.removeChild(link)

//     // Revoke the URL to free up resources
//     URL.revokeObjectURL(url)
//   }

//   return (
//     <div>
//       <button onClick={onClick}>Generate</button>
//       <a href="/"></a>
//     </div>
//   )
// }

// export default Test
//***********************************************************************
// import React, { useRef, useState } from "react"
// import { useUser } from "../features/Authentication/useUser"
// import { HiOutlinePencilAlt as EditIcon } from "react-icons/hi"
// import styled from "styled-components"
// const Container = styled.div``
// const Content = styled.div`
//   max-width: 50rem;
//   margin: 0 auto;
//   margin-top: 10rem;
//   background-color: var(--color-grey-100);
//   box-shadow: var(--shadow);
//   position: relative;
//   min-height: 100dvh;
//   overflow: hidden;
// `
// const Item = styled.div<{ t: number }>`
//   transform: translateX(${(props) => props.t}%);
//   background-color: var(--color-stone-500);
//   transition: transform 0.3s ease;
//   width: 50rem;
//   position: absolute;
//   top: 0;
//   left: 0;
// `
// const data = Array.from({ length: 10 }, (v, i) => i)

// const Test = () => {
//   const [percentage, setPercentage] = useState(0)
//   const questions = [
//     {
//       id: 30,
//       questionText: "For how long you have been married ?",
//       valueType:
//         "checkbox/1/We've been married for less than 2 years/<2/2/We've been married for more than 2 years/>2/3/We've been married for more than 7 years/>7/4/We've been married for more than 12 years/>12",
//       description: "Please specify the exact amount of time.",
//       texte: "<p><br></p>",
//       descriptionDetails:
//         "Knowing how long you've been married is crutial so make sure to specify it.",
//       Description: "Please specify the exact amount of time.",
//       description_details:
//         "Knowing how long you've been married is crutial so make sure to specify it.",
//       text_area: "<p><br></p>"
//     },
//     {
//       id: 27,
//       questionText: "How old are you ?",
//       valueType: "number",
//       description: "Please specify your age.",
//       texte: "<p>I'm [value] years old.</p>",
//       descriptionDetails:
//         "the next questions are related to your aged so please specify it",
//       Description: "Please specify your age.",
//       description_details:
//         "the next questions are related to your aged so please specify it",
//       text_area: "<p>I'm [value] years old.</p>"
//     },
//     {
//       id: 28,
//       questionText: "Where do you live?",
//       valueType: "input",
//       description: "Please specify where you live.",
//       texte: "<p>I live in [value].</p>",
//       descriptionDetails: "We need to know where you live.",
//       Description: "Please specify where you live.",
//       description_details: "We need to know where you live.",
//       text_area: "<p>I live in [value].</p>"
//     },
//     {
//       id: 29,
//       questionText: "Tell us about your situation with your wife.",
//       valueType: "textarea",
//       description:
//         "Please specify How the divorce started and who initiate it first.",
//       texte: "<p>content</p><p><br></p>",
//       descriptionDetails: "give us as much informations as you you can.",
//       Description:
//         "Please specify How the divorce started and who initiate it first.",
//       description_details: "give us as much informations as you you can.",
//       text_area: "<p>content</p><p><br></p>"
//     }
//   ]
//   const [overviewData, setOverviewData] = useState<
//     { question: string; value: string; active: boolean }[]
//   >(
//     questions.map((q, i) => {
//       return { question: q.questionText, value: "", active: i == 0 }
//     })
//   )
//   const doesActiveQuestionHaveValue =
//     overviewData.find((q) => q.active)?.value !== ""

//   console.log(overviewData)
//   const next = () => {
//     if (!doesActiveQuestionHaveValue) return
//     setPercentage((curr) => curr - 1)
//     setOverviewData((data) => {
//       const indexOfActiveQuestion = data.findIndex((q) => q.active)
//       return data.map((q, i) =>
//         i === indexOfActiveQuestion
//           ? { ...q, active: false }
//           : i === indexOfActiveQuestion + 1
//           ? { ...q, active: true }
//           : q
//       )
//     })
//   }
//   const prev = () => {
//     setPercentage((curr) => curr + 1)
//     setOverviewData((data) => {
//       const indexOfActiveQuestion = data.findIndex((q) => q.active)
//       return data.map((q, i) =>
//         i === indexOfActiveQuestion
//           ? { ...q, active: false }
//           : i === indexOfActiveQuestion - 1
//           ? { ...q, active: true }
//           : q
//       )
//     })
//   }
//   return (
//     <Container>
//       {/* <div>
//         {!overviewData.at(0)?.active && <button onClick={prev}>Prev</button>}
//         <button disabled={!doesActiveQuestionHaveValue} onClick={next}>
//         Next
//         </button>
//       </div> */}
//       <Content>

//         {questions.map((question, index) => (
//           <Item t={(index + percentage) * 100}>
//             <h1>{question.questionText}</h1>
//             <input
//               type="text"
//               value={overviewData.at(index)?.value}
//               onChange={(e) =>
//                 setOverviewData((data) => {
//                   return data.map((q, i) =>
//                     i === index ? { ...q, value: e.target.value } : q
//                   )
//                 })
//               }
//             />
//             <div>
//               {!overviewData.at(0)?.active && (
//                 <button onClick={prev}>Prev</button>
//               )}
//               <button disabled={!doesActiveQuestionHaveValue} onClick={next}>
//                 Next
//               </button>
//             </div>
//           </Item>
//         ))}
//         {
//           <Item t={(questions.length + percentage) * 100}>
//             <h1>Overiew</h1>
//             <ul>
//               {overviewData.map((d, index) => (
//                 <li>
//                   <h4>{d.question}</h4>
//                   <h5>{d.value}</h5>
//                   <button
//                     onClick={() =>
//                       setPercentage(
//                         // -4 + 4 + 1
//                         (curr) => curr + overviewData.length + index
//                       )
//                     }
//                   >
//                     <EditIcon />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <button>Proceed to Checkout</button>
//           </Item>
//         }
//       </Content>
//     </Container>
//   )
// }

// export default Test
//********************************************************************
// import React, { useState } from "react"
// import { useUser } from "../features/Authentication/useUser"
// import styled from "styled-components"
// const Container = styled.div``
// const Content = styled.div`
//   max-width: 50rem;
//   margin: 0 auto;
//   margin-top: 10rem;
//   background-color: var(--color-grey-100);
//   box-shadow: var(--shadow);
//   position: relative;
//   min-height: 100dvh;
//   overflow: hidden;
// `
// const Item = styled.div<{ t: number }>`
//   transform: translateX(${(props) => props.t}%);
//   background-color: var(--color-stone-500);
//   transition: transform 0.3s ease;
//   width: 50rem;
//   position: absolute;
//   top: 0;
//   left: 0;
// `
// const data = Array.from({ length: 10 }, (v, i) => i)
// const Test = () => {
//   const [percentage, setPercentage] = useState(0)
//   const questions = [
//     {
//       id: 30,
//       questionText: "For how long you have been married ?",
//       valueType:
//         "checkbox/1/We've been married for less than 2 years/<2/2/We've been married for more than 2 years/>2/3/We've been married for more than 7 years/>7/4/We've been married for more than 12 years/>12",
//       description: "Please specify the exact amount of time.",
//       texte: "<p><br></p>",
//       descriptionDetails:
//         "Knowing how long you've been married is crutial so make sure to specify it.",
//       Description: "Please specify the exact amount of time.",
//       description_details:
//         "Knowing how long you've been married is crutial so make sure to specify it.",
//       text_area: "<p><br></p>"
//     },
//     {
//       id: 27,
//       questionText: "How old are you ?",
//       valueType: "number",
//       description: "Please specify your age.",
//       texte: "<p>I'm [value] years old.</p>",
//       descriptionDetails:
//         "the next questions are related to your aged so please specify it",
//       Description: "Please specify your age.",
//       description_details:
//         "the next questions are related to your aged so please specify it",
//       text_area: "<p>I'm [value] years old.</p>"
//     },
//     {
//       id: 28,
//       questionText: "Where do you live?",
//       valueType: "input",
//       description: "Please specify where you live.",
//       texte: "<p>I live in [value].</p>",
//       descriptionDetails: "We need to know where you live.",
//       Description: "Please specify where you live.",
//       description_details: "We need to know where you live.",
//       text_area: "<p>I live in [value].</p>"
//     },
//     {
//       id: 29,
//       questionText: "Tell us about your situation with your wife.",
//       valueType: "textarea",
//       description:
//         "Please specify How the divorce started and who initiate it first.",
//       texte: "<p>content</p><p><br></p>",
//       descriptionDetails: "give us as much informations as you you can.",
//       Description:
//         "Please specify How the divorce started and who initiate it first.",
//       description_details: "give us as much informations as you you can.",
//       text_area: "<p>content</p><p><br></p>"
//     }
//   ]
//   return (
//     <Container>
//       <div>
//         <button onClick={() => setPercentage((curr) => curr + 1)}>Prev</button>
//         <button onClick={() => setPercentage((curr) => curr - 1)}>Next</button>
//       </div>
//       <Content>
//         {data.map((item) => (
//           <Item t={(item + percentage) * 100}>{item}</Item>
//         ))}
//       </Content>
//     </Container>
//   )
// }

// export default Test
// import React, { useRef, useState } from "react"
// import { useUser } from "../features/Authentication/useUser"
// import { HiOutlinePencilAlt as EditIcon } from "react-icons/hi"
// import styled from "styled-components"
// import { AnimatePresence, motion } from "framer-motion"
// const Container = styled.div``
// const Content = styled.div`
//   max-width: 50rem;
//   margin: 0 auto;
//   margin-top: 10rem;
//   background-color: var(--color-grey-100);
//   box-shadow: var(--shadow);
//   position: relative;
//   min-height: 100dvh;
//   overflow: hidden;
// `
// const Item = styled.div`
//   background-color: var(--color-stone-500);
//   transition: transform 0.3s ease;
//   width: 50rem;
//   position: absolute;
//   top: 0;
//   left: 0;
// `

// const Test = () => {
//   const questions = [
//     {
//       id: 30,
//       questionText: "For how long you have been married ?",
//       valueType:
//         "checkbox/1/We've been married for less than 2 years/<2/2/We've been married for more than 2 years/>2/3/We've been married for more than 7 years/>7/4/We've been married for more than 12 years/>12",
//       description: "Please specify the exact amount of time.",
//       texte: "<p><br></p>",
//       descriptionDetails:
//         "Knowing how long you've been married is crutial so make sure to specify it.",
//       Description: "Please specify the exact amount of time.",
//       description_details:
//         "Knowing how long you've been married is crutial so make sure to specify it.",
//       text_area: "<p><br></p>"
//     },
//     {
//       id: 27,
//       questionText: "How old are you ?",
//       valueType: "number",
//       description: "Please specify your age.",
//       texte: "<p>I'm [value] years old.</p>",
//       descriptionDetails:
//         "the next questions are related to your aged so please specify it",
//       Description: "Please specify your age.",
//       description_details:
//         "the next questions are related to your aged so please specify it",
//       text_area: "<p>I'm [value] years old.</p>"
//     },
//     {
//       id: 28,
//       questionText: "Where do you live?",
//       valueType: "input",
//       description: "Please specify where you live.",
//       texte: "<p>I live in [value].</p>",
//       descriptionDetails: "We need to know where you live.",
//       Description: "Please specify where you live.",
//       description_details: "We need to know where you live.",
//       text_area: "<p>I live in [value].</p>"
//     },
//     {
//       id: 29,
//       questionText: "Tell us about your situation with your wife.",
//       valueType: "textarea",
//       description:
//         "Please specify How the divorce started and who initiate it first.",
//       texte: "<p>content</p><p><br></p>",
//       descriptionDetails: "give us as much informations as you you can.",
//       Description:
//         "Please specify How the divorce started and who initiate it first.",
//       description_details: "give us as much informations as you you can.",
//       text_area: "<p>content</p><p><br></p>"
//     }
//   ]
//   const [overviewData, setOverviewData] = useState<
//     { question: string; value: string; active: boolean }[]
//   >(
//     questions.map((q, i) => {
//       return { question: q.questionText, value: "", active: i == 0 }
//     })
//   )
//   const doesActiveQuestionHaveValue =
//     overviewData.find((q) => q.active)?.value !== ""

//   return (
//     <Container>
//       <Content>
//         {questions.map(
//           (question, index) =>
//             overviewData.at(index)?.active && (
//               <Item key={question.id}>
//                 <h1>{question.questionText}</h1>
//                 <input
//                   type="text"
//                   value={overviewData.at(index)?.value}
//                   onChange={(e) =>
//                     setOverviewData((data) => {
//                       return data.map((q, i) =>
//                         i === index ? { ...q, value: e.target.value } : q
//                       )
//                     })
//                   }
//                 />
//                 <div>
//                   {!overviewData.at(0)?.active && (
//                     <button
//                       onClick={() => {
//                         setOverviewData((data) =>
//                           data.map((item, i) => {
//                             if (i === index - 1)
//                               return { ...item, active: true }
//                             else return { ...item, active: false }
//                           })
//                         )
//                       }}
//                     >
//                       Prev
//                     </button>
//                   )}
//                   <button
//                     disabled={!doesActiveQuestionHaveValue}
//                     onClick={() => {
//                       setOverviewData((data) =>
//                         data.map((item, i) => {
//                           if (i === index + 1) return { ...item, active: true }
//                           else return { ...item, active: false }
//                         })
//                       )
//                     }}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </Item>
//             )
//         )}
//         {overviewData.every((item) => !item.active) && (
//           <Item key="overview">
//             <h1>Overiew</h1>
//             <ul>
//               {overviewData.map((d, index) => (
//                 <li>
//                   <h4>{d.question}</h4>
//                   <h5>{d.value}</h5>
//                   <button
//                     onClick={() => {
//                       setOverviewData((data) =>
//                         data.map((q, i) =>
//                           i === index
//                             ? { ...q, active: true }
//                             : { ...q, active: false }
//                         )
//                       )
//                     }}
//                   >
//                     <EditIcon />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <button>Proceed to Checkout</button>
//           </Item>
//         )}
//       </Content>
//     </Container>
//   )
// }

// export default Test
// //***********************************************************************
// // import React, { useRef, useState } from "react"
// // import { useUser } from "../features/Authentication/useUser"
// // import { HiOutlinePencilAlt as EditIcon } from "react-icons/hi"
// // import styled from "styled-components"
// // const Container = styled.div``
// // const Content = styled.div`
// //   max-width: 50rem;
// //   margin: 0 auto;
// //   margin-top: 10rem;
// //   background-color: var(--color-grey-100);
// //   box-shadow: var(--shadow);
// //   position: relative;
// //   min-height: 100dvh;
// //   overflow: hidden;
// // `
// // const Item = styled.div<{ t: number }>`
// //   transform: translateX(${(props) => props.t}%);
// //   background-color: var(--color-stone-500);
// //   transition: transform 0.3s ease;
// //   width: 50rem;
// //   position: absolute;
// //   top: 0;
// //   left: 0;
// // `
// // const data = Array.from({ length: 10 }, (v, i) => i)

// // const Test = () => {
// //   const [percentage, setPercentage] = useState(0)
// //   const questions = [
// //     {
// //       id: 30,
// //       questionText: "For how long you have been married ?",
// //       valueType:
// //         "checkbox/1/We've been married for less than 2 years/<2/2/We've been married for more than 2 years/>2/3/We've been married for more than 7 years/>7/4/We've been married for more than 12 years/>12",
// //       description: "Please specify the exact amount of time.",
// //       texte: "<p><br></p>",
// //       descriptionDetails:
// //         "Knowing how long you've been married is crutial so make sure to specify it.",
// //       Description: "Please specify the exact amount of time.",
// //       description_details:
// //         "Knowing how long you've been married is crutial so make sure to specify it.",
// //       text_area: "<p><br></p>"
// //     },
// //     {
// //       id: 27,
// //       questionText: "How old are you ?",
// //       valueType: "number",
// //       description: "Please specify your age.",
// //       texte: "<p>I'm [value] years old.</p>",
// //       descriptionDetails:
// //         "the next questions are related to your aged so please specify it",
// //       Description: "Please specify your age.",
// //       description_details:
// //         "the next questions are related to your aged so please specify it",
// //       text_area: "<p>I'm [value] years old.</p>"
// //     },
// //     {
// //       id: 28,
// //       questionText: "Where do you live?",
// //       valueType: "input",
// //       description: "Please specify where you live.",
// //       texte: "<p>I live in [value].</p>",
// //       descriptionDetails: "We need to know where you live.",
// //       Description: "Please specify where you live.",
// //       description_details: "We need to know where you live.",
// //       text_area: "<p>I live in [value].</p>"
// //     },
// //     {
// //       id: 29,
// //       questionText: "Tell us about your situation with your wife.",
// //       valueType: "textarea",
// //       description:
// //         "Please specify How the divorce started and who initiate it first.",
// //       texte: "<p>content</p><p><br></p>",
// //       descriptionDetails: "give us as much informations as you you can.",
// //       Description:
// //         "Please specify How the divorce started and who initiate it first.",
// //       description_details: "give us as much informations as you you can.",
// //       text_area: "<p>content</p><p><br></p>"
// //     }
// //   ]
// //   const [overviewData, setOverviewData] = useState<
// //     { question: string; value: string; active: boolean }[]
// //   >(
// //     questions.map((q, i) => {
// //       return { question: q.questionText, value: "", active: i == 0 }
// //     })
// //   )
// //   const doesActiveQuestionHaveValue =
// //     overviewData.find((q) => q.active)?.value !== ""

// //   console.log(overviewData)
// //   const next = () => {
// //     if (!doesActiveQuestionHaveValue) return
// //     setPercentage((curr) => curr - 1)
// //     setOverviewData((data) => {
// //       const indexOfActiveQuestion = data.findIndex((q) => q.active)
// //       return data.map((q, i) =>
// //         i === indexOfActiveQuestion
// //           ? { ...q, active: false }
// //           : i === indexOfActiveQuestion + 1
// //           ? { ...q, active: true }
// //           : q
// //       )
// //     })
// //   }
// //   const prev = () => {
// //     setPercentage((curr) => curr + 1)
// //     setOverviewData((data) => {
// //       const indexOfActiveQuestion = data.findIndex((q) => q.active)
// //       return data.map((q, i) =>
// //         i === indexOfActiveQuestion
// //           ? { ...q, active: false }
// //           : i === indexOfActiveQuestion - 1
// //           ? { ...q, active: true }
// //           : q
// //       )
// //     })
// //   }
// //   return (
// //     <Container>
// //       {/* <div>
// //         {!overviewData.at(0)?.active && <button onClick={prev}>Prev</button>}
// //         <button disabled={!doesActiveQuestionHaveValue} onClick={next}>
// //         Next
// //         </button>
// //       </div> */}
// //       <Content>

// //         {questions.map((question, index) => (
// //           <Item t={(index + percentage) * 100}>
// //             <h1>{question.questionText}</h1>
// //             <input
// //               type="text"
// //               value={overviewData.at(index)?.value}
// //               onChange={(e) =>
// //                 setOverviewData((data) => {
// //                   return data.map((q, i) =>
// //                     i === index ? { ...q, value: e.target.value } : q
// //                   )
// //                 })
// //               }
// //             />
// //             <div>
// //               {!overviewData.at(0)?.active && (
// //                 <button onClick={prev}>Prev</button>
// //               )}
// //               <button disabled={!doesActiveQuestionHaveValue} onClick={next}>
// //                 Next
// //               </button>
// //             </div>
// //           </Item>
// //         ))}
// //         {
// //           <Item t={(questions.length + percentage) * 100}>
// //             <h1>Overiew</h1>
// //             <ul>
// //               {overviewData.map((d, index) => (
// //                 <li>
// //                   <h4>{d.question}</h4>
// //                   <h5>{d.value}</h5>
// //                   <button
// //                     onClick={() =>
// //                       setPercentage(
// //                         // -4 + 4 + 1
// //                         (curr) => curr + overviewData.length + index
// //                       )
// //                     }
// //                   >
// //                     <EditIcon />
// //                   </button>
// //                 </li>
// //               ))}
// //             </ul>
// //             <button>Proceed to Checkout</button>
// //           </Item>
// //         }
// //       </Content>
// //     </Container>
// //   )
// // }

// // export default Test
// //********************************************************************
// // import React, { useState } from "react"
// // import { useUser } from "../features/Authentication/useUser"
// // import styled from "styled-components"
// // const Container = styled.div``
// // const Content = styled.div`
// //   max-width: 50rem;
// //   margin: 0 auto;
// //   margin-top: 10rem;
// //   background-color: var(--color-grey-100);
// //   box-shadow: var(--shadow);
// //   position: relative;
// //   min-height: 100dvh;
// //   overflow: hidden;
// // `
// // const Item = styled.div<{ t: number }>`
// //   transform: translateX(${(props) => props.t}%);
// //   background-color: var(--color-stone-500);
// //   transition: transform 0.3s ease;
// //   width: 50rem;
// //   position: absolute;
// //   top: 0;
// //   left: 0;
// // `
// // const data = Array.from({ length: 10 }, (v, i) => i)
// // const Test = () => {
// //   const [percentage, setPercentage] = useState(0)
// //   const questions = [
// //     {
// //       id: 30,
// //       questionText: "For how long you have been married ?",
// //       valueType:
// //         "checkbox/1/We've been married for less than 2 years/<2/2/We've been married for more than 2 years/>2/3/We've been married for more than 7 years/>7/4/We've been married for more than 12 years/>12",
// //       description: "Please specify the exact amount of time.",
// //       texte: "<p><br></p>",
// //       descriptionDetails:
// //         "Knowing how long you've been married is crutial so make sure to specify it.",
// //       Description: "Please specify the exact amount of time.",
// //       description_details:
// //         "Knowing how long you've been married is crutial so make sure to specify it.",
// //       text_area: "<p><br></p>"
// //     },
// //     {
// //       id: 27,
// //       questionText: "How old are you ?",
// //       valueType: "number",
// //       description: "Please specify your age.",
// //       texte: "<p>I'm [value] years old.</p>",
// //       descriptionDetails:
// //         "the next questions are related to your aged so please specify it",
// //       Description: "Please specify your age.",
// //       description_details:
// //         "the next questions are related to your aged so please specify it",
// //       text_area: "<p>I'm [value] years old.</p>"
// //     },
// //     {
// //       id: 28,
// //       questionText: "Where do you live?",
// //       valueType: "input",
// //       description: "Please specify where you live.",
// //       texte: "<p>I live in [value].</p>",
// //       descriptionDetails: "We need to know where you live.",
// //       Description: "Please specify where you live.",
// //       description_details: "We need to know where you live.",
// //       text_area: "<p>I live in [value].</p>"
// //     },
// //     {
// //       id: 29,
// //       questionText: "Tell us about your situation with your wife.",
// //       valueType: "textarea",
// //       description:
// //         "Please specify How the divorce started and who initiate it first.",
// //       texte: "<p>content</p><p><br></p>",
// //       descriptionDetails: "give us as much informations as you you can.",
// //       Description:
// //         "Please specify How the divorce started and who initiate it first.",
// //       description_details: "give us as much informations as you you can.",
// //       text_area: "<p>content</p><p><br></p>"
// //     }
// //   ]
// //   return (
// //     <Container>
// //       <div>
// //         <button onClick={() => setPercentage((curr) => curr + 1)}>Prev</button>
// //         <button onClick={() => setPercentage((curr) => curr - 1)}>Next</button>
// //       </div>
// //       <Content>
// //         {data.map((item) => (
// //           <Item t={(item + percentage) * 100}>{item}</Item>
// //         ))}
// //       </Content>
// //     </Container>
// //   )
// // }

// // export default Test
