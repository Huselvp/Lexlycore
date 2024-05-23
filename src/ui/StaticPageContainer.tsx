import styled from "styled-components"

export const Container = styled.div`
  /* background-color: var(--color-stone-50); */
  h2 {
    margin-bottom: 5rem;
  }
  p {
    margin-top: 1rem;
    font-size: 1.5rem;
    /* font-weight: 500; */
  }
  padding: 2rem 4rem;
  padding-bottom: 7rem;
  padding-top: 5rem;
  & > div {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 2rem;
    h2,
    h3 {
      text-align: start;
    }
  }
  ul,
  ol {
    padding-top: 1rem;
    padding-left: 3rem;
  }
  ul {
    list-style: disc;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  strong {
    font-size: 1.4rem;
  }
  a {
    color: var(--color-blue-500);
    font-weight: 500;
    font-size: 1.4rem;
    text-decoration: underline;
  }
`
export const Ul = styled.ul`
  list-style: none !important;
`
export const ListItem = styled.li<{ number: string }>`
  position: relative;
  &::before {
    /* content: "akro"; */
    font-weight: 600;
    content: "${(props) => props.number}.";
    /* color: black; */
    /* font-size: 1.6rem; */
    position: absolute;
    top: 0;
    left: -2rem;
    /* transform: translateY(-50%); */
  }
`
