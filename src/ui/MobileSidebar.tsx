import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useLogout } from "../features/Authentication/useLogout";
import { HiOutlineX as CloseMenuIcon } from "react-icons/hi";
import { createPortal } from "react-dom";
import { useUser } from "../features/Authentication/useUser";

const Container = styled.div<{ hide: "true" | "false" }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  background-color: var(--white);
  z-index: 10000000;
  display: grid;
  grid-template-rows: min-content 1fr;
  padding: 2rem 2.5rem;
  width: 40rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  transform: ${(props) =>
    props.hide === "true" ? "translateX(-100%)" : "translateX(0%)"};
  /* box-shadow: var(); */
  nav {
    align-self: center;
    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      li {
        a,
        button {
          color: var(--color-grey-500);
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-weight: 500;
          padding: 1.2rem 2.4rem;
          &:hover,
          &.active {
            color: var(--color-stone-500);
          }
          svg,
          img {
            display: block;
            width: 2.4rem;
            height: 2.4rem;
            color: var(--color-grey-400);
          }
          img {
            border-radius: 50%;
            object-fit: center;
          }
        }
      }
    }
  }
`;
const Btn = styled.button`
  display: block;
  border: none;
  background-color: transparent;
  width: 100%;
  border: 1px solid var(--color-stone-500);
  box-shadow: var(--shadow);
  border-radius: var(--rounded);
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  justify-self: flex-start;
  svg {
    color: var(--color-stone-500);
    font-size: 3rem;
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

const MobileSidebar = ({
  hideSidebarOnMobile,
  setHideSidebarOnMobile,
}: {
  hideSidebarOnMobile: boolean;
  setHideSidebarOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { logout } = useLogout();
  const { user } = useUser();
  const hideSidebar = () => {
    setHideSidebarOnMobile(true);
  };
  if (hideSidebarOnMobile) return null;
  return createPortal(
    <>
      <Overlay onClick={() => setHideSidebarOnMobile(true)} />
      <Container hide={hideSidebarOnMobile ? "true" : "false"}>
        <CloseBtn onClick={hideSidebar}>
          <CloseMenuIcon />
        </CloseBtn>
        <nav>
          <ul>
            {
              // @ts-ignore
              user?.role === "ADMIN" && (
                <>
                  <li onClick={hideSidebar}>
                    <NavLink to="/a">
                      <span>Dashboard</span>
                    </NavLink>
                  </li>
                  <li onClick={hideSidebar}>
                    <NavLink to="/a/templates">
                      <span>Templates</span>
                    </NavLink>
                  </li>
                  <li onClick={hideSidebar}>
                    <NavLink to="/a/categories">
                      <span>Subcategories</span>
                    </NavLink>
                  </li>
                  <li onClick={hideSidebar}>
                    <NavLink to="/a/users">
                      <span>Users</span>
                    </NavLink>
                  </li>
                </>
              )
            }
            {
              // @ts-ignore
              user?.role === "SUSER" && (
                <>
                  <li>
                    <NavLink to="/u">
                      <span>Documents</span>
                    </NavLink>
                  </li>
                </>
              )
            }
            <li onClick={hideSidebar}>
              <NavLink
                to={`/${
                  // @ts-ignore
                  user?.role === "ADMIN" ? "a" : "u"
                }/account`}
              >
                <span>Account</span>
              </NavLink>
            </li>
            <li>
              <Btn onClick={() => logout()}>
                <span>Logout</span>
              </Btn>
            </li>
          </ul>
        </nav>
      </Container>
    </>,

    document.getElementById("root")!
  );
};

export default MobileSidebar;
