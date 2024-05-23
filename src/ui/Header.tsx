import { useLocation } from "react-router-dom"
import Banner from "./Banner"
import Navbar from "./Navbar"

const Header = () => {
  const location = useLocation()
  return (
    <header>
      {location.pathname === "/" && <Banner />}
      <Navbar />
    </header>
  )
}

export default Header
