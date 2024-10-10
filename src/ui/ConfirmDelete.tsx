import styled from "styled-components";

const ConfirmDelete = styled.div`
  /* width: minmax(max-content, 50rem); */
  width: 70vw;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  /* 500px */
  @media screen and (max-width: 31.25em) {
    width: 85vw;
  }
  & h3 {
    text-align: left;
  }
  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

export default ConfirmDelete;
