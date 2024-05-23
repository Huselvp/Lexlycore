import { RxHamburgerMenu as MenuIcon } from "react-icons/rx"
import styled from "styled-components"
const MenuBtn = styled.button`
  background: none;
  border: none;
`
const ProfileNavMobile = () => {
  const onClick = () => {}
  return (
    <MenuBtn onClick={onClick}>
      <MenuIcon />
    </MenuBtn>
  )
}

export default ProfileNavMobile
