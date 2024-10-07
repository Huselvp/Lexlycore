import styled, { css } from "styled-components";
import Logo from "./Logo";
import ProfileNav from "./ProfileNav";
import {
  HiChevronDoubleLeft as LeftArrow,
  HiChevronDoubleRight as RightArrow,
} from "react-icons/hi";
import { useEffect, useState } from "react";

const Aside = styled.aside<{ shorten: "true" | "false" }>`
  position: relative;
  background-color: var(--white);
  border-right: 1px solid var(--color-grey-100);
  height: 100dvh;
  /* padding: 1rem 2.4rem; */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  & header {
    padding-left: 1.5rem;
  }
  /* ON MOBILE */
  @media screen and (max-width: 37.5em) {
    /* 600px */
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: auto;
    transform: translateX(-100%);
    z-index: 1000000;
  }
  /* ON MOBILE */
  ${(props) =>
    props.shorten === "true" &&
    css`
      padding: 1rem;
      header {
        padding-left: 0;
      }
    `}
`;

const Btn = styled.button<{ shorten: "true" | "false" }>`
  background: none;
  border: none;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: var(--shadow);
  z-index: 10000;
  background-color: var(--white);
  &:focus {
    border-radius: 50%;
  }
  &:hover {
    background-color: var(--color-grey-100);
  }
  svg {
    font-size: 1.5rem;
  }
  ${(props) =>
    props.shorten === "true" &&
    css`
      position: absolute;
      right: -1rem;
      top: 6.5rem;
    `}
`;
const Header = styled.header`
  /* padding: 0 4rem; */
  /* padding-left: 1.5rem; */
  a img {
    height: 4rem;
  }
  svg {
    color: var(--color-grey-400);
    /* font-size: 2.25rem; */
  }
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
const Sidebar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [shortenSidebar, setShortenSidebar] = useState(windowWidth < 1000);
  const hideBtn = windowWidth < 1000;

  const handleResize = () => {
    setWindowWidth(window.innerWidth);

    if (window.innerWidth < 1000) setShortenSidebar(true);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <Aside shorten={shortenSidebar ? "true" : "false"}>
      <Header>
        <Logo onShorten={shortenSidebar} />
        {!hideBtn && (
          <Btn
            onClick={() => setShortenSidebar((shorten) => !shorten)}
            shorten={shortenSidebar ? "true" : "false"}
          >
            {shortenSidebar ? <RightArrow /> : <LeftArrow />}
          </Btn>
        )}
      </Header>
      <ProfileNav onShorten={shortenSidebar} />
      
    </Aside>
  );
};

export default Sidebar;
