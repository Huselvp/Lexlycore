import styled from "styled-components";
import Logo from "./Logo";
import { HiOutlineMenuAlt2 as BurgerIcon } from "react-icons/hi";
import { useUser } from "../features/Authentication/useUser";

const Header = styled.header`
  position: relative;
  background-color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 1rem 2.5rem;
  border-bottom: 2px solid var(--color-grey-100);
  color: var(--color-grey-400);
  svg {
    font-size: 2rem;
    color: currentColor;
  }
  & > div:first-child {
    font-size: 1.4rem;
    color: var(--color-grey-600);
    & p:first-child {
      font-weight: 500;
      color: var(--color-grey-500);
      line-height: 1.2;
    }
    & p:last-child {
      text-transform: capitalize;
      font-weight: 600;
    }
  }
  & > div:last-child {
    display: flex;
    align-items: center;
    gap: 2rem;
    & > a:first-child {
      padding: 0.25rem;
      background-color: var(--white);
      box-shadow: var(--shadow);
      border-radius: 50%;
    }
  }
`;
const ImgContainer = styled.div`
  color: var(--color-grey-500);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  img {
    width: 3rem;
    height: 3rem;
  }
  button {
    background: none;
    border: none;
  }
`;

const Burger = styled.button`
  background: none;
  border: none;
  svg {
    font-size: 3rem;
  }
`;

const ProfileHeader = ({
  setHideSidebarOnMobile,
  onMobile,
}: {
  setHideSidebarOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
  onMobile: boolean;
}) => {
  const { user } = useUser();
  return (
    <Header>
      {onMobile ? (
        <>
          <Burger onClick={() => setHideSidebarOnMobile(false)}>
            <BurgerIcon />
          </Burger>
          <Logo />
        </>
      ) : (
        <div>
          <p>Welcome,</p>
          <p>
            {user?.firstname || ""} {user?.lastname || ""}
          </p>
        </div>
      )}
      <div>
        <ImgContainer>
          <img src="/user.jpg" />
        </ImgContainer>
      </div>
    </Header>
  );
};

export default ProfileHeader;
