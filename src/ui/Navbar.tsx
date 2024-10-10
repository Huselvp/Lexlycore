import styled, { css } from "styled-components";
import Button from "./Button";
import Logo from "./Logo";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { RxHamburgerMenu as BurgerIcon } from "react-icons/rx";
import { LiaTimesSolid as TimesIcon } from "react-icons/lia";
import { createPortal } from "react-dom";
import { useState } from "react";
import SubMenu from "./SubMenu";
import Searchbar from "./Searchbar";
import { useWindowListener } from "../hooks/useWindowListener";
import { HiOutlineSearch } from "react-icons/hi";
import { HiArrowSmallLeft } from "react-icons/hi2";

const StyledNavbar = styled.nav<{ hideTemplates: boolean }>`
  position: relative;
  /* padding: 1rem 2rem; */
  padding: 0 2rem;
  display: grid;
  grid-template-columns: min-content max-content 1fr max-content;
  align-items: center;
  justify-content: space-between;
  color: black;
  gap: 3rem;
  /* box-shadow: var(--shadow); */
  border-bottom: 1px solid var(--color-grey-300);
  /* margin-bottom: 5rem; */
  & > ul {
    justify-self: center;
    display: flex;
    align-items: center;
    gap: 2rem;
    & > li {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 2.5rem 0;
      color: var(--color-grey-700);
      cursor: pointer;
      /* font-weight: 500; */
      font-size: 1.5rem;
      border-bottom: 2px solid transparent;
    }
  }
  /* 899px */
  ${(props) =>
    props.hideTemplates &&
    css`
      grid-template-columns: min-content 1fr max-content;
      padding: 1.5rem 2rem;
      gap: 1rem;
    `}
`;
const Btn = styled(Button)`
  /* padding: 1rem 3rem; */
  border-radius: var(--rounded-4xl);
  font-size: 1.3rem;
`;
const BtnsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;
const LoginBtn = styled(Btn)`
  background-color: transparent;
  color: var(--color-stone-500);
  border: 1px solid currentColor;
  &:hover {
    background-color: var(--color-stone-150);
  }
`;

const BurgerBtn = styled.button`
  border: none;
  background: none;
  font-size: 2.5rem;
  margin-left: 1rem;
  & svg {
    color: var(--color-grey-700);
    stroke-width: 0.25;
  }
`;
const StyledMenu = styled.menu`
  position: fixed;
  top: 0;
  right: 0;
  background-color: var(--white);
  height: 100dvh;
  width: 30rem;
  padding: 2rem 0 2rem;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  z-index: 10000000;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content max-content;
  overflow-y: auto;
  & ul {
    margin-top: 3rem;
  }
  & ul li {
    /* border-bottom: 1px solid var(--color-grey-200); */
  }
  & ul li a {
    padding: 1rem 2rem;
    display: block;
    font-weight: 500;
  }
  & ul li a:hover {
    background-color: var(--color-grey-100);
  }
  & button:last-child {
    margin-top: 3rem;
    justify-self: center;
  }
`;
const TimesBtn = styled.button`
  display: flex;
  margin-left: auto;
  background: none;
  border: none;
  font-size: 2.5rem;
  margin-right: 2rem;
  & svg {
    /* stroke-width: 1; */
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  z-index: 10000;
`;
const SearchBtn = styled.button`
  background: none;
  border: none;
  justify-self: end;
  width: 3rem;
  margin-right: 2rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    color: var(--color-stone-500);
    font-size: 2.5rem;
  }
`;
const SearchbarContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
  /* background-color: var(--color-grey-50); */
  background-color: var(--white);
  display: grid;
  align-items: center;
  gap: 3rem;
  grid-template-columns: max-content 1fr;
  padding: 0 2rem;
  & > button {
    border: none;
    background: none;
    font-size: 3rem;
    color: var(--color-grey-500);
  }
  & form {
    /* width: 50rem; */
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const [isSearchbarContainerHidden, setIsSearchbarContainerHidden] = useState(
    !searchParams.get("s")
  );
  const { windowWidth } = useWindowListener();
  const Menu = createPortal(
    <>
      <Overlay onClick={() => setIsMenuHidden(true)} />
      <StyledMenu>
        <TimesBtn onClick={() => setIsMenuHidden(true)}>
          <TimesIcon />
        </TimesBtn>
        <ul>
          <li>
            <Link onClick={() => setIsMenuHidden(true)} to="/about">
              Om os
            </Link>
          </li>
          <li>
            <Link onClick={() => setIsMenuHidden(true)} to="/news">
              Nyheder
            </Link>
          </li>
          <li>
            <Link onClick={() => setIsMenuHidden(true)} to="/templates">
              Skabeloner
            </Link>
          </li>
          <li>
            <Link onClick={() => setIsMenuHidden(true)} to="/dictionary">
              Ordbog
            </Link>
          </li>
          <li>
            <Link onClick={() => setIsMenuHidden(true)} to="/contact">
              Kontakt os
            </Link>
          </li>
          
        </ul>
        {windowWidth < 700 && (
          <LoginBtn
            onClick={() => navigate("/login/user")}
            variation="priamry"
            size="large"
          >
            Min side
          </LoginBtn>
        )}
      </StyledMenu>
    </>,
    document.body
  );
  return (
    <StyledNavbar hideTemplates={windowWidth < 900}>
      {!isSearchbarContainerHidden && windowWidth < 700 && (
        <SearchbarContainer>
          <button onClick={() => setIsSearchbarContainerHidden(true)}>
            <HiArrowSmallLeft />
          </button>
          <Searchbar />
        </SearchbarContainer>
      )}
      {!isMenuHidden && Menu}
      <Logo />
      {windowWidth >= 900 && (
        <ul>
          <SubMenu />
        </ul>
      )}
      {windowWidth >= 700 ? (
        <Searchbar />
      ) : (
        <SearchBtn
          onClick={() => setIsSearchbarContainerHidden((curr) => !curr)}
        >
          <HiOutlineSearch />
        </SearchBtn>
      )}
      <BtnsContainer>
        {windowWidth >= 700 && (
          <>
            <LoginBtn
              onClick={() => navigate("/login/user")}
              variation="priamry"
              size="large"
            >
              Min side
            </LoginBtn>
            <Btn
              onClick={() => navigate("/register")}
              variation="priamry"
              size="large"
            >
              Opret konto
            </Btn>
          </>
        )}
        <BurgerBtn onClick={() => setIsMenuHidden(false)}>
          <BurgerIcon />
        </BurgerBtn>
      </BtnsContainer>
    </StyledNavbar>
  );
};

export default Navbar;
