import styled from "styled-components"
import { FcApproval } from "react-icons/fc"

const data = [
  {
    img: "",
    title: "Ubegrænset adgang – døgnet rundt"
  },
  {
    img: "",
    title: "Begrænset tidsforbrug"
  },
  {
    img: "",
    title: "Til en brøkdel af prisen ift. en advokat"
  },
  {
    img: "",
    title: "Optimér dine processer"
  },
  {
    img: "",
    title: "Ajourført og kvalitetssikret"
  },
  {
    img: "",
    title:
      "Underskriv med digital signatur eller udskriv til fysisk underskrift"
  },
  {
    img: "",
    title: "Integration til CVR"
  },
  {
    img: "",
    title: "Dokumentopbevaring i vores system"
  },
  {
    img: "",
    title: "Undgå manuelle fejl"
  },
  {
    img: "",
    title: "Adgang til kundesupport gennem chat, mail og telefon. "
  }
]
const Container = styled.div`
  background-color: var(--color-grey-50);
  /* background-color: var(--white); */
  display: grid;
  grid-template-columns: minmax(min-content, 105rem);
  justify-content: center;
  padding: 6rem 2rem;
  & ul {
    margin-top: 5rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1rem;
    & li {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      & svg {
        font-size: 2rem;
      }
    }
  }
  /* 500px */
  @media screen and (max-width: 31.25em) {
    & ul {
      grid-template-columns: 1fr;
      & li {
        justify-content: center;
      }
    }
  }
  @media screen and (max-width: 25em) {
    & ul {
      /* padding-left: 1rem; */
      & li {
        justify-content: unset;
      }
    }
  }
`
const Section2 = () => {
  return (
    <Container>
      <div>
        <h2>Dine fordele med Docura</h2>
        <ul>
          {data.map((item) => (
            <li>
              <span>
                {/* <FcCheckmark /> */}
                <FcApproval />
              </span>
              <p>{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

export default Section2
