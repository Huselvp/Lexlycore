import styled from "styled-components"
const videoData = [
  "Besvar og udfyld spørgsmålene i vores formular ved brug af vores dokumentgenerator.",
  "Udkast gemmes og kan redigeres i vores system.",
  "Modtag dokumentet på mail eller download direkte via vores system.",
  "Underskriv via. digital signatur eller udskriv til fysisk underskrift."
]
const Container = styled.div`
  padding: 6rem 2rem;
  display: grid;
  /* grid-template-columns: repeat(2, 1fr); */
  grid-template-columns: 1fr 1.4fr;
  gap: 1rem 5rem;

  & > div:first-child {
    background-color: #f9f9f9;
    background-color: var(--color-grey-100);
    border: 1px solid #efefef;
    border-radius: 8px;
    padding: 1.5rem 2.5rem;
    & div {
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  & div:last-child {
    align-self: center;
    h2 {
      text-align: start;
    }
    ul {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      li {
        display: flex;
        gap: 1rem;
        p {
          font-size: 1.5rem;
          color: var(--color-grey-500);
        }
        span {
          font-weight: 600;
          color: var(--color-stone-500);
        }
      }
    }
  }
  /* 1000px */
  @media screen and (max-width: 62.5em) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 3rem;
  }
  /* 800px */
  @media screen and (max-width: 50em) {
    grid-template-columns: 1fr;
    gap: 5rem 3rem;
    /* text-align: center; */
    justify-items: center;
    & > div:first-child {
      grid-row: 2/3;
      max-width: 60rem;
    }
    & > div:last-child {
      & h2 {
        text-align: center;
      }
      & ul {
        gap: 2rem;
      }
    }
  }
`
const VideoSection = () => {
  return (
    <Container>
      <div>
        <div>
          {/* <video width="100%" height="100%" autoPlay loop muted> */}
          <video width="100%" height="100%" muted controls autoPlay>
            <source src="/docura-v1.mp4" />
          </video>
        </div>
      </div>
      <div>
        <h2>Mere simpelt bliver det ikke</h2>
        <ul>
          {videoData.map((item, index) => (
            <li>
              <span>{(index + 1).toString().padStart(2, "0")}.</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

export default VideoSection
