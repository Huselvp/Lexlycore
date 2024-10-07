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
