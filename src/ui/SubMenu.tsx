import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { MdKeyboardArrowDown as ArrowDownIcon } from "react-icons/md";
import { MdOutlineKeyboardArrowRight as ArrowRightIcon } from "react-icons/md";
import { useTemplates } from "../features/Templates/useTemplates";
import { useCategories } from "../features/Categories/useCategories";
import { useNavigate } from "react-router-dom";

const Sub = styled(motion.div)`
  /* display: inline-block; */
  z-index: 1000;
  width: auto;
  position: absolute;
  top: 103%;
  /* top: 210%; */
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-items: start;
  & > div {
    color: var(--color-grey-700);
    border: 1px solid var(--color-grey-100);
    padding: 1rem 0;
    background-color: var(--white);
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    & div {
      font-size: 1.3rem;
      font-weight: 400;
      display: grid;
      grid-template-columns: 1fr max-content;
      gap: 2rem;

      align-items: center;
      /* color: var(--color-grey-500); */
      padding: 0.75rem 1rem;
      cursor: pointer;
      &:hover {
        color: var(--color-stone-400);
      }
    }
  }
`;

const Item = styled.li<{ active: "true" | "false" }>`
  /* background-color: red; */
  color: ${(props) =>
    props.active === "true"
      ? "var(--color-stone-500)"
      : "currentColor"} !important;
`;

const SubMenu = () => {
  const navigate = useNavigate();
  const { templates } = useTemplates();
  const { categories } = useCategories();
  const [currCategory, setCurrCategory] = useState<
    "private" | "business" | null
  >(null);
  const [currSubCategoryIndex, setCurrSubCategoryIndex] = useState<
    null | number
  >(null);

  const data: {
    private: { cat: Category; templates: Template[] }[];
    business: { cat: Category; templates: Template[] }[];
  } = {
    private: categories
      .filter((cat) => cat.categoryType === "PRIVATE")
      .map((cat) => {
        return {
          cat,
          templates: templates.filter(
            (temp) => temp.subcategory?.id === cat.id
          ),
        };
      }),
    business: categories
      .filter((cat) => cat.categoryType === "BUSINESS")
      .map((cat) => {
        return {
          cat,
          templates: templates.filter(
            (temp) => temp.subcategory?.id === cat.id
          ),
        };
      }),
  };

  if (!data.private.length && !data.private.length)
    return (
      <>
        <Item active="false">
          <span>Privat</span>
          <ArrowDownIcon />
        </Item>
        <Item active="false">
          <span>Erhverv</span>
          <ArrowDownIcon />
        </Item>
      </>
    );

  return Object.entries(data).map((menu) => (
    <Item
      active={currCategory === menu[0] ? "true" : "false"}
      onMouseOver={() => {
        setCurrCategory(menu[0] as "private" | "business");
      }}
      onMouseLeave={() => {
        setCurrCategory(null);
        setCurrSubCategoryIndex(null);
      }}
    >
      <span>{menu[0] === "private" ? "Privat" : "Erhverv"}</span>
      <ArrowDownIcon />
      {currCategory === menu[0] && (
        <Sub
          onMouseLeave={() => {
            setCurrCategory(null);
            setCurrSubCategoryIndex(null);
          }}
        >
          <div>
            {menu[1].map((item, index) => (
              <div
                style={{
                  color: `${
                    index === currSubCategoryIndex
                      ? "var(--color-stone-500)"
                      : "currentColor"
                  }`,
                }}
                onMouseEnter={() => setCurrSubCategoryIndex(index)}
              >
                <span>{item.cat.name}</span>
                <ArrowRightIcon />
              </div>
            ))}
          </div>
          {currSubCategoryIndex !== null && (
            <div>
              {menu[1][currSubCategoryIndex].templates.map((item) => (
                <div onClick={() => navigate(`/templates/${item.id}`)}>
                  {item.templateName}
                </div>
              ))}
            </div>
          )}
        </Sub>
      )}
    </Item>
  ));
};

export default SubMenu;
// import { useState } from "react"
// import styled from "styled-components"
// import { motion } from "framer-motion"
// import { MdKeyboardArrowDown as ArrowDownIcon } from "react-icons/md"
// import { MdOutlineKeyboardArrowRight as ArrowRightIcon } from "react-icons/md"
// import { useTemplates } from "../features/Templates/useTemplates"

// const menuData = {
//   private: [
//     {
//       title: "Familie",
//       data: [
//         {
//           icon: "",
//           description: "Testamente"
//         },
//         {
//           icon: "",
//           description: "Testamente for ægtefæller"
//         },
//         {
//           icon: "",
//           description: "Testamente for ugifte samlevende"
//         },
//         {
//           icon: "",
//           description: "Testamente for enlige"
//         },
//         {
//           icon: "",
//           description: "Testamente over indbo"
//         },
//         {
//           icon: "",
//           description: "Ægtepagt om skilsmissesæreje"
//         },
//         {
//           icon: "",
//           description: "Ægtepagt om fuldstændigt særeje"
//         },
//         {
//           icon: "",
//           description: "Ægtepagt om særeje ved død"
//         },
//         {
//           icon: "",
//           description: "Ægtepagt om kombinationssæreje"
//         },
//         {
//           icon: "",
//           description: "Ægtepagt om pensionsdeling"
//         }
//       ]
//     },
//     {
//       title: "Lån",
//       data: [
//         {
//           icon: "",
//           description: "Anfordringslån (familielån)"
//         },
//         {
//           icon: "",
//           description: "Gældsbrev"
//         },
//         {
//           icon: "",
//           description: "Låneaftale"
//         }
//       ]
//     },
//     {
//       title: "Fuldmagt",
//       data: [
//         {
//           icon: "",
//           description: "Fremtidsfuldmagt"
//         },
//         {
//           icon: "",
//           description: "Generel fuldmagt"
//         }
//       ]
//     },
//     {
//       title: "Bolig",
//       data: [
//         {
//           icon: "",
//           description: "Lejekontrakt"
//         },
//         {
//           icon: "",
//           description: "Fremlejekontrakt"
//         },
//         {
//           icon: "",
//           description: "Samejekontrakt"
//         }
//       ]
//     },
//     {
//       title: "Køb og salg",
//       data: [
//         {
//           icon: "",
//           description: "Salg af brugt bil"
//         },
//         {
//           icon: "",
//           description: "Reklamation"
//         },
//         {
//           icon: "",
//           description: "Fortrydelsesret"
//         },
//         {
//           icon: "",
//           description: "Køb af entreprise ydelser"
//         }
//       ]
//     },
//     {
//       title: "Persondata",
//       data: [
//         {
//           icon: "",
//           description: "Tilbagekaldelse af samtykke"
//         },
//         {
//           icon: "",
//           description: "Indsigelse mod behandling"
//         },
//         {
//           icon: "",
//           description: "Indsigtsret i personoplysninger"
//         },
//         {
//           icon: "",
//           description: "Ret til berigtigelse"
//         },
//         {
//           icon: "",
//           description: "Retten til sletning af sine data"
//         },
//         {
//           icon: "",
//           description: "Sletning af sociale medier"
//         },
//         {
//           icon: "",
//           description: "Ret til flytning af sine data"
//         }
//       ]
//     }
//   ],
//   business: [
//     {
//       title: "Selskabsstiftelse",
//       data: [
//         {
//           icon: "",
//           description: "Oprettelse af en enkeltmandsvirksomhed"
//         },
//         {
//           icon: "",
//           description: "Oprettelse af et ApS"
//         },
//         {
//           icon: "",
//           description: "Oprettelse af et A/S"
//         },
//         {
//           icon: "",
//           description: "Oprettelse af en holdingstruktur"
//         },
//         {
//           icon: "",
//           description: "Oprettelse af en forening "
//         }
//       ]
//     },
//     {
//       title: "Medarbejderforhold",
//       data: [
//         {
//           icon: "",
//           description: "Ansættelseskontrakt"
//         },
//         {
//           icon: "",
//           description: "Væsentlige ændringer af ansættelsesvilkår"
//         },
//         {
//           icon: "",
//           description: "Bortvisning"
//         },
//         {
//           icon: "",
//           description: "Direktørkontrakt"
//         },
//         {
//           icon: "",
//           description: "Skriftlig advarsel"
//         }
//       ]
//     },
//     {
//       title: "Selskabsadministration",
//       data: [
//         {
//           icon: "",
//           description: "Ændring af regnskabsår"
//         },
//         {
//           icon: "",
//           description: "Ændring af tegningsregel"
//         },
//         {
//           icon: "",
//           description: "Ændre firmanavn"
//         },
//         {
//           icon: "",
//           description: "Indkaldelse til ekstraordinær generalforsamling"
//         },
//         {
//           icon: "",
//           description: "Generalforsamlingsreferat"
//         },
//         {
//           icon: "",
//           description: "Vedtægter"
//         }
//       ]
//     },
//     {
//       title: "Øvrige dokumenter",
//       data: [
//         {
//           icon: "",
//           description: "Ejeraftale"
//         },
//         {
//           icon: "",
//           description: "Ejerbog"
//         },
//         {
//           icon: "",
//           description: "Handelsbetingelser"
//         },
//         {
//           icon: "",
//           description: "Inkassobrev"
//         },
//         {
//           icon: "",
//           description: "NDA"
//         },
//         {
//           icon: "",
//           description: "Ny direktør"
//         },
//         {
//           icon: "",
//           description: "Ny revisor"
//         },
//         {
//           icon: "",
//           description: "Påkravsbrev"
//         },
//         {
//           icon: "",
//           description: "Rykkerbrev"
//         },
//         {
//           icon: "",
//           description: "Cookiepolitik"
//         }
//       ]
//     }
//   ]
// }

// const Sub = styled(motion.div)`
//   /* display: inline-block; */
//   z-index: 1000;
//   width: auto;
//   position: absolute;
//   top: 103%;
//   /* top: 210%; */
//   left: 0;
//   display: grid;
//   grid-template-columns: repeat(2, max-content);
//   align-items: start;
//   & > div {
//     color: var(--color-grey-700);
//     border: 1px solid var(--color-grey-100);
//     padding: 1rem 0;
//     background-color: var(--white);
//     display: grid;
//     grid-template-columns: 1fr;
//     gap: 0;
//     & div {
//       font-size: 1.3rem;
//       font-weight: 400;
//       display: grid;
//       grid-template-columns: 1fr max-content;
//       gap: 2rem;

//       align-items: center;
//       /* color: var(--color-grey-500); */
//       padding: 0.75rem 1rem;
//       cursor: pointer;
//       &:hover {
//         color: var(--color-stone-400);
//       }
//     }
//   }
// `

// const Item = styled.li<{ active: "true" | "false" }>`
//   /* background-color: red; */
//   color: ${(props) =>
//     props.active === "true"
//       ? "var(--color-stone-500)"
//       : "currentColor"} !important;
// `
// const SubMenu = () => {
//   const [currCategory, setCurrCategory] = useState<
//     "private" | "business" | null
//   >(null)
//   const [currSubCategoryIndex, setCurrSubCategoryIndex] = useState<
//     null | number
//   >(null)

//   return Object.entries(menuData).map((menu) => (
//     <Item
//       active={currCategory === menu[0] ? "true" : "false"}
//       // onMouseEnter
//       onMouseOver={() => {
//         console.log("ON lI")
//         setCurrCategory(menu[0] as "private" | "business")
//       }}
//       onMouseLeave={() => {
//         console.log("OUT lI")
//         setCurrCategory(null)
//         setCurrSubCategoryIndex(null)
//       }}
//     >
//       <span>{menu[0] === "private" ? "Privat" : "Erhverv"}</span>
//       <ArrowDownIcon />
//       {currCategory === menu[0] && (
//         <Sub
//           onMouseLeave={() => {
//             setCurrCategory(null)
//             setCurrSubCategoryIndex(null)
//           }}
//         >
//           <div>
//             {menu[1].map((item, index) => (
//               <div
//                 style={{
//                   color: `${
//                     index === currSubCategoryIndex
//                       ? "var(--color-stone-500)"
//                       : "currentColor"
//                   }`
//                 }}
//                 onMouseEnter={() => setCurrSubCategoryIndex(index)}
//               >
//                 <span>{item.title}</span>
//                 <ArrowRightIcon />
//               </div>
//             ))}
//           </div>
//           {currSubCategoryIndex !== null && (
//             <div>
//               {menu[1][currSubCategoryIndex].data.map((item) => (
//                 <div>{item.description}</div>
//               ))}
//             </div>
//           )}
//         </Sub>
//       )}
//     </Item>
//   ))
// }

// export default SubMenu
