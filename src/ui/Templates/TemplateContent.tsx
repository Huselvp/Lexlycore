import styled from "styled-components";
import { useTemplate } from "../../features/Templates/useTemplate";

const Container = styled.div`
  grid-row: 2/3;
  grid-column: 1/2;
  & h1 {
    font-weight: 600;
    font-size: 3.5rem;
  }
  & h2 {
    font-weight: 600;
    font-size: 3rem;
  }
  & h3 {
    font-weight: 500;
    font-size: 3rem;
  }
  & h4 {
    font-weight: 500;
    font-size: 2.5rem;
  }
  & h5 {
    font-weight: 500;
    font-size: 2rem;
  }
  & h6 {
    font-weight: 500;
    font-size: 1.5rem;
  }
  & p {
    font-size: 1.6rem;
    color: var(--color-grey-500);
  }
  @media screen and (max-width: 56.25em) {
    grid-row: 3/4;
    /* text-align: center; */
  }
`;
const TemplateContent = () => {
  const { template } = useTemplate();
  const content = template?.content || "";
  return <Container dangerouslySetInnerHTML={{ __html: content }}></Container>;
};

export default TemplateContent;
