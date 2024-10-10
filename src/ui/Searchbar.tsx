import styled from "styled-components";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Container = styled.form`
  position: relative;
  svg {
    /* color: var(--color-stone-500); */
    color: var(--color-grey-400);
    stroke-width: 0.75;
    font-size: 2.5rem;
    top: 50%;
    left: 3%;
    transform: translateY(-50%);
    position: absolute;
  }
  input {
    background-color: var(--color-grey-50);
    padding: 1.25rem;
    padding-left: 5rem;
    /* font-size: 1.6rem; */
    border: none;
    color: black;
    /* background-color: var(--color-stone-100); */
    &::placeholder {
      /* color: #aaa; */
      /* font-style: italic; */
      /* font-weight: 400; */
    }
    border: 1px solid var(--color-grey-300);
    border-radius: var(--rounded-4xl);
    &:focus {
      /* outline: 2px solid var(--color-stone-600); */
      /* outline-offset: -2px; */
      /* border-color: transparent; */
    }
  }
`;
const Searchbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const search: string = searchParams.get("s") || "";
  // Hack
  // ****
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    if (formElement instanceof HTMLFormElement) {
      const search: string = formElement.search.value;
      navigate("/templates?s=" + search);
    }
  };
  return (
    <Container onSubmit={onSubmit}>
      <input
        autoComplete="off"
        name="search"
        type="text"
        defaultValue={location.pathname === "/templates" ? search : ""}
        placeholder="Søg efter en skabelon her ..."
      />
      <SearchIcon />
    </Container>
  );
};

export default Searchbar;
