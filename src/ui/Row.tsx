import styled from "styled-components"

const Row = styled.div<{
  direction: "column" | "row"
  gap: string
  align?: "flex-start" | "flex-end" | "center"
  justify?: "flex-start" | "flex-end" | "center"
}>`
  position: relative;
  display: flex;
  flex-direction: ${(props) => props.direction};
  gap: ${(props) => props.gap};
  align-items: ${(props) => props.align || "unset"};
  justify-content: ${(props) => props.justify || "unset"};
`
Row.defaultProps = {
  direction: "column",
  gap: "2rem"
}

export default Row
