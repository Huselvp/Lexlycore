import Footer from "./Footer"
import Header from "./Header"
import { Outlet } from "react-router-dom"

const SearchLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default SearchLayout
