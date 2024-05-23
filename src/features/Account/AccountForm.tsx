import styled from "styled-components"

export const ARow = styled.div`
  display: grid;
  grid-template-columns: 20rem 35rem;
  align-items: center;
  @media screen and (max-width: 31.25em) {
    /* 500px */
    grid-template-columns: 15rem 1fr;
  }
  @media screen and (max-width: 25em) {
    /* 400px */
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`
export const AContainer = styled.form`
  padding: 2.4rem 4rem;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  & > div:last-child {
    align-self: end;
    /* background-color: red; */
  }
`
