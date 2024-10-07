import {
  HiOutlineUsers as UsersIcon,
  HiMiniArrowLeftOnRectangle as LogoutIcon,
  HiOutlineUserCircle as UserIcon,
} from "react-icons/hi2";
import { HiOutlineHome as HomeIcon } from "react-icons/hi";
import { BiCategory as CategoriesIcon } from "react-icons/bi";
import { CgTemplate as TemplatesIcon } from "react-icons/cg";
import { IoDocumentOutline as DocumentIcon } from "react-icons/io5";

import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { useLogout } from "../features/Authentication/useLogout";
import { useUser } from "../features/Authentication/useUser";

const Nav = styled.nav``;
const List = styled.ul<{ shorten: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  font-size: 1.5rem;
  button,
  a {
    color: var(--color-grey-500);
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    &:hover,
    &.active {
      background-color: var(--color-grey-100);
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
  ${(props) =>
    props.shorten === "true" &&
    css`
      a,
      button {
        padding: 1rem;
        border-radius: 50%;
      }
    `}
`;

const Btn = styled.button`
  display: block;
  border: none;
  background-color: transparent;
  width: 100%;
`;

const ProfileNav = ({ onShorten }: { onShorten: boolean }) => {
  const { isLoading, logout } = useLogout();
  const { user } = useUser();
  return (
    <Nav>
      <List shorten={onShorten ? "true" : "false"}>
        {user?.role === "ADMIN" && (
          <>
            <li>
              <NavLink to="/a/dashboard">
                <HomeIcon />
                {!onShorten && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/a/templates">
                <TemplatesIcon />
                {!onShorten && <span>Templates</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/a/categories">
                <CategoriesIcon />
                {!onShorten && <span>Subcategories</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/a/users">
                <UsersIcon />
                {!onShorten && <span>Users</span>}
              </NavLink>
            </li>
          </>
        )}
        {user?.role === "SUSER" && (
          <li>
            <NavLink to="/u/documents">
              <DocumentIcon />
              {!onShorten && <span>Documents</span>}
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to={`/${user?.role === "ADMIN" ? "a" : "u"}/account`}>
            <UserIcon />
            {!onShorten && <span>Account</span>}
          </NavLink>
        </li>
        <li>
          <Btn onClick={() => logout()}>
            <LogoutIcon />
            {!onShorten && (
              <span>{isLoading ? "Logging out..." : "Logout"}</span>
            )}
          </Btn>
        </li>
      </List>
    </Nav>
  );
};

export default ProfileNav;
