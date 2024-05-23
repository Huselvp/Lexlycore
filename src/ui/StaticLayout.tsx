import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import Header from "./Header"
import { Container } from "./StaticPageContainer"
import { useScrollToTop } from "../hooks/useScrollToTop"

const StaticLayout = () => {
  useScrollToTop()
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </>
  )
}

export default StaticLayout
