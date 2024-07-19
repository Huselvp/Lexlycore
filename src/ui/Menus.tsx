import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisHorizontal, HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useClickOutside } from "../hooks/useClickOutside";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--rounded-md);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    display: block;
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;
  z-index: 10;
  right: 1rem;
  top: 5rem;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--rounded-md);
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;
type MenusContextProps = {
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
  openId: string;
};
const MenusContext = createContext<MenusContextProps>({
  open: () => {},
  close: () => {},
  openId: "",
});

function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState("");

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider value={{ openId, close, open }}>
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({
  id,
  horizontalIcon,
}: {
  id: string;
  horizontalIcon?: boolean;
}) {
  const { openId, close, open } = useContext(MenusContext);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openId === "" || openId !== id ? open(id) : close();
  };

  return (
    <StyledToggle onClick={handleClick}>
      {horizontalIcon ? <HiEllipsisHorizontal /> : <HiEllipsisVertical />}
    </StyledToggle>
  );
}

function List({ id, children }: { id: string; children: ReactNode }) {
  const { openId, close } = useContext(MenusContext);
  const ref = useClickOutside(close, false);

  if (openId !== id) return null;

  return createPortal(
    <StyledList ref={ref}>{children}</StyledList>,
    document.getElementById(`menus-row--${id}`)!
  );
}

function ListSub({ id, children }: { id: string; children: ReactNode }) {
  const { openId, close } = useContext(MenusContext);
  const ref = useClickOutside(close, false);

  if (openId !== id) return null;

  return createPortal(
    <StyledList ref={ref}>{children}</StyledList>,
    document.getElementById(`menus-row--sq--${id}`)!
  );
}

function Button({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
Menus.ListSub = ListSub;

export default Menus;
