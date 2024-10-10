import styled, { css } from "styled-components";
import { FaCheck } from "react-icons/fa";
import { useMemo } from "react";

const Container = styled.div`
  margin: 0 auto;
`;
const List = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem 1rem;
`;
const Li = styled.li<{ active: "true" | "false" }>`
  font-weight: 700;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  color: var(--color-stone-500);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
  ${(props) =>
    props.active === "true" &&
    css`
      background-color: var(--color-stone-200);
    `}
`;
const QuestiontsSlider = ({
  length,
  activeQuestion,
}: {
  length: number;
  activeQuestion: number;
}) => {
  const data = useMemo(() => Array.from({ length }, (i) => i), [length]);
  return (
    <Container>
      <List>
        {activeQuestion === -1
          ? data.map((item) => (
              // @ts-ignore
              <Li active={"true"} key={item}>
                <FaCheck />
              </Li>
            ))
          : data.map((item, index) => (
              // <Li
              //   active={item === activeQuestion ? "true" : "false"}
              //   key={item}
              // >
              //   {item < activeQuestion ? <FaCheck /> : item + 1}
              // </Li>

              <Li
                active={item === activeQuestion ? "true" : "false"}
                key={index}
              >
                {Number(item) < activeQuestion ? <FaCheck /> : Number(item) + 1}
              </Li>
            ))}
      </List>
    </Container>
  );
};

export default QuestiontsSlider;
