import styled, { css } from "styled-components"
import { useTemplates } from "./useTemplates"
import { useNavigate, useSearchParams } from "react-router-dom"
import { formatCurrency } from "../../utils/helpers"
import { useMemo, useState } from "react"

const Container = styled.div`
  padding: 4rem 2.5rem 15rem;
  background-color: var(--white);
  min-height: 100dvh;
  & > h2 {
    font-size: 3rem;
  }
  & > p:first-of-type {
    margin-top: 1rem;
    font-size: 1.8rem;
    color: var(--color-grey-500);
  }
`
const Items = styled.ul`
  margin-top: 3rem;
  display: grid;
  /* grid-template-columns: repeat(3, 1fr); */
  grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
  /* grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr)); */
  grid-auto-rows: 25rem;
  gap: 4rem 3rem;
  & li {
    cursor: pointer;
    padding: 2rem;
    background-color: var(--white);
    border-radius: var(--rounded-2xl);
    box-shadow: var(--shadow);
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr min-content;
    align-items: center;
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: translateY(-0.5rem);
    }
    & > span:first-child {
      font-weight: 600;
      font-size: 1.7rem;
      &::first-letter {
        text-transform: uppercase;
      }
    }
    & span:last-child {
      /* margin-top: 2rem; */
      font-weight: 500;
      align-self: end;
      /* justify-self: end; */
    }
    & p {
      color: var(--color-grey-500);
      font-size: 1.4rem;
      align-self: start;
    }
  }
`
const Filters = styled.div`
  padding: 1.5rem 0 1rem 0;
  /* padding-bottom: 1rem; */
  /* border-bottom: 2px solid var(--color-grey-100); */
  border-bottom: 1px solid var(--color-grey-200);
  display: flex;
  margin-bottom: 2rem;
  /* margin-top: 2rem;
  display: flex;
  gap: 1rem;
  & a {
    font-weight: 500;
  }
  & a:first-child {
    border-bottom: 2px solid var(--color-stone-500);
  } */
`
const FiltersItem = styled.li<{ active: boolean }>`
  position: relative;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  gap: 1rem;
  font-weight: 500;
  ${(props) =>
    props.active &&
    css`
      color: var(--color-stone-600);
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: calc(-1rem - 1px);
        width: 100%;
        height: 1px;
        background-color: currentColor;
      }
    `}
`
const TemplateDes = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 6; /* Change this value to the number of lines you want to display */
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
`
const TemplatesContent = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { templates } = useTemplates()
  const [filteredBy, setFilteredBy] = useState<"all" | "private" | "business">(
    "all"
  )

  if (!templates) return null

  const search = searchParams.get("s") || ""

  const data = useMemo(() => {
    let array: Template[] =
      filteredBy === "private"
        ? templates.filter((tem) => tem.subcategory?.categoryType === "PRIVATE")
        : filteredBy === "business"
        ? templates.filter(
            (tem) => tem.subcategory?.categoryType === "BUSINESS"
          )
        : templates
    if (!search || typeof search !== "string") return array
    else
      return array.filter((item) =>
        item.templateName?.toLowerCase().includes(search.toLowerCase())
      )
  }, [filteredBy, search])

  return (
    <Container>
      <Filters>
        <FiltersItem
          active={filteredBy === "all"}
          onClick={() => setFilteredBy("all")}
        >
          All
        </FiltersItem>
        <FiltersItem
          active={filteredBy === "private"}
          onClick={() => setFilteredBy("private")}
        >
          Privat
        </FiltersItem>
        <FiltersItem
          active={filteredBy === "business"}
          onClick={() => setFilteredBy("business")}
        >
          Erhverv
        </FiltersItem>
      </Filters>
      <Items>
        {data.length > 0 ? (
          data.map((tem) => (
            <li onClick={() => navigate(`/templates/${tem.id}`)}>
              <span>{tem.templateName}</span>
              <TemplateDes>{tem.templateDescription}</TemplateDes>
              <span>{formatCurrency(tem.cost)}</span>
            </li>
          ))
        ) : (
          <div>No templates were found.</div>
        )}
      </Items>
    </Container>
  )
}

export default TemplatesContent
