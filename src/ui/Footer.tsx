import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import Logo from "./Logo"

const StyledFooter = styled.footer`
  border-top: 1px solid var(--color-stone-300);
  background-color: var(--white);
  background-color: var(--color-stone-650);
  background-color: var(--color-grey-50);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 6rem 2rem 3rem;
  gap: 4rem 2rem;
  & nav {
    & > div {
      font-weight: 600;
      font-size: 1.7rem;
      margin-bottom: 3rem;
      /* color: var(--color-grey-600); */
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    & li {
      font-size: 1.3rem;
      font-weight: 400;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  svg {
    font-size: 2rem;
  }
  p {
    /* margin-top: 1rem; */
    font-size: 1.3rem;
    span {
      font-weight: 600;
    }
  }
  a {
    font-weight: 500;
    font-size: 1.5rem;
  }
  @media screen and (max-width: 37.5em) {
    grid-template-columns: 1fr;
    /* justify-content: center; */
    justify-items: center;
    text-align: center;
    & nav > div {
      margin-bottom: 1rem;
    }
  }
`
// const Title = styled.div`
//   font-size: 3rem;
//   font-weight: 800;
//   line-height: 0.9;
// `
const LogoContainer = styled.div`
  & a {
    display: inline-block;
    /* justify-content: flex-start; */
  }
`
const Footer = () => {
  const navigate = useNavigate()
  return (
    <StyledFooter>
      <nav>
        <LogoContainer>
          <Logo />
          {/* <Title>Docura</Title> */}
        </LogoContainer>
        {/* <ul>
          <li>
            Office Address : Frederikskaj 4, 1st floor 2450 Copenhagen SW CVR:
            40300635
          </li>
          <li>Email: info@docura.dk</li>
          <li>Tel: 53 70 05 15</li>
        </ul> */}
      </nav>
      <nav>
        <div>Information</div>
        <ul>
          <li onClick={() => navigate("/about")}>Om os</li>
          <li onClick={() => navigate("/contact")}>Kontakt</li>
          <li onClick={() => navigate("/terms&conditions")}>
            Vilkår og betingelser
          </li>
          <li onClick={() => navigate("/privacy")}>Fortrolighedspolitik</li>
        </ul>
      </nav>
      <nav>
        <div>Populære dokumenter</div>
        <ul>
          <li>Fremtidsfuldmagt</li>
          <li>Testamente</li>
          <li>Skiftebrev</li>
          <li>Fremlejeaftale</li>
          <li>Indkøb af byggeydelser</li>
          <li>Samejekontrakt</li>
        </ul>
      </nav>
      <nav>
        <div>Genveje</div>
        <ul>
          <li>Ofte stillede spørgsmål</li>
          <li>Privat</li>
          <li>Erhverv</li>
        </ul>
      </nav>
    </StyledFooter>
  )
}

export default Footer
// import styled from "styled-components"
// import Logo from "./Logo"
// import {
//   FaInstagram as InstagramIcon,
//   FaFacebook as FacebookIcon,
//   FaTwitter as TwitterIcon
// } from "react-icons/fa"
// import { Link } from "react-router-dom"

// const StyledFooter = styled.footer`
//   /* border-top: 1px solid var(--color-stone-300); */
//   background-color: var(--color-stone-850);
//   color: var(--color-stone-200);
//   /* color: var(--color-stone-600); */
//   display: flex;
//   align-items: center;
//   flex-direction: column;
//   gap: 2rem;
//   justify-content: center;
//   padding: 3rem 2rem;
//   ul {
//     display: flex;
//     gap: 2rem;
//   }
//   svg {
//     font-size: 2rem;
//   }
//   p {
//     /* margin-top: 1rem; */
//     font-size: 1.3rem;
//     span {
//       font-weight: 600;
//     }
//   }
//   a {
//     font-weight: 500;
//     font-size: 1.5rem;
//   }
// `
// const Title = styled.div`
//   font-size: 3rem;
//   font-weight: 800;
// `
// const Footer = () => {
//   return (
//     <StyledFooter>
//       {/* <Logo /> */}
//       <Title>Docura</Title>
//       <nav>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/about">About</Link>
//           </li>
//           <li>
//             <Link to="/privacy">Privacy</Link>
//           </li>
//           <li>
//             <Link to="/terms&conditions">Terms & Conditions</Link>
//           </li>
//         </ul>
//       </nav>
//       <ul>
//         <li>
//           <a href="#">
//             <FacebookIcon />
//           </a>
//         </li>
//         <li>
//           <a href="#">
//             <TwitterIcon />
//           </a>
//         </li>
//         <li>
//           <a href="#">
//             <InstagramIcon />
//           </a>
//         </li>
//       </ul>
//       <p>
//         &copy; {new Date().getFullYear()} By <span>Iker</span>
//       </p>
//     </StyledFooter>
//   )
// }

// export default Footer
