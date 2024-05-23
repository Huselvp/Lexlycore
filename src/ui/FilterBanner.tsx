import { useState } from "react"
import styled, { css } from "styled-components"
import { useDocuments } from "../features/Documents/useDocuments"

const Container = styled.ul`
  padding: 1.5rem;
  padding-bottom: 1rem;
  /* border-bottom: 2px solid var(--color-grey-100); */
  border-bottom: 1px solid var(--color-grey-200);
  display: flex;
  margin-bottom: 2rem;
`
const Item = styled.li<{ active: boolean }>`
  position: relative;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  gap: 1rem;
  & > span:last-child {
    background-color: var(--color-stone-150);
    padding: 0.25rem 1rem;
    border-radius: var(--rounded-md);
    /* color: var(--color-grey-600); */
    color: var(--color-stone-600);

    font-weight: 600;
    font-size: 1.2rem;
  }
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
const items: {
  label: string
  value: "all" | "draft" | "paid" | "unpaid"
  quantity: number
}[] = [
  {
    label: "All",
    value: "all",
    quantity: 0
  },
  {
    label: "Draft",
    value: "draft",
    quantity: 0
  },
  {
    label: "Paid",
    value: "paid",
    quantity: 0
  },
  {
    label: "Unpaid",
    value: "unpaid",
    quantity: 0
  }
]
const FilterBanner = ({
  setFilter
}: {
  setFilter: React.Dispatch<
    React.SetStateAction<"all" | "draft" | "paid" | "unpaid">
  >
}) => {
  const { documents } = useDocuments()
  const [activeIndex, setActiveIndex] = useState(0)
  const onClick = (index: number) => {
    setActiveIndex(index)
  }

  const all = documents.length
  const draft = documents.filter((doc) => doc.draft).length
  const paid = documents.filter((doc) => !doc.draft && doc.paymentStatus).length
  const unpaid = documents.filter(
    (doc) => !doc.draft && !doc.paymentStatus
  ).length

  const data = items.map((item) => {
    if (item.value === "all") return { ...item, quantity: all }
    if (item.value === "draft") return { ...item, quantity: draft }
    if (item.value === "paid") return { ...item, quantity: paid }
    if (item.value === "unpaid") return { ...item, quantity: unpaid }
  })

  return (
    <Container>
      {data.map((item, index) => (
        <Item
          key={item!.value}
          active={activeIndex === index}
          onClick={() => {
            setFilter(item!.value)
            onClick(index)
          }}
        >
          <span>{item!.label}</span>
          <span>{item!.quantity}</span>
        </Item>
      ))}
    </Container>
  )
}

export default FilterBanner
