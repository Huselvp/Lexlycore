import styled from "styled-components"

const firstData = [
  {
    title: "Besvar spørgsmålene og udfyld formularen",
    img: "https://www.legaldesk.dk/css/img_new/TOP_1.svg"
  },
  {
    title:
      "Modtag straks dit dokument i PDF-format på mail eller download direkte",
    img: "https://www.legaldesk.dk/css/img_new/TOP_2.svg"
  },
  {
    title:
      "Underskriv digitalt med MitID eller udskriv dokument til underskrift.",
    img: "https://www.legaldesk.dk/css/img_new/TOP_3.svg"
  }
]

const Container = styled.section`
  /* background-color: var(--color-grey-100); */
  background-color: var(--color-stone-150);
  padding: 5rem 3.2rem;
  & h2 {
    text-align: center;
    margin-bottom: 5rem;
  }
  & > div:first-of-type {
    display: grid;
    /* grid-template-columns: 0.8fr 1.5fr; */
    grid-template-columns: 35rem 1fr;
    gap: 3rem;
    img {
      max-width: 100%;
      /* height: 20rem; */
      box-shadow: var(--shadow);
      /* object-fit: cover; */
      display: block;
      border-radius: var(--rounded-xl);
    }
  }
`
const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: start;
  /* justify-items: start; */
  gap: 3rem;
  li {
    /* background-color: var(--color-stone-150); */
    background-color: var(--color-grey-50);
    border-radius: var(--rounded-4xl);
    padding: 1rem 2rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
    gap: 1rem;
    span {
      font-weight: 700;
      font-size: 2rem;
      color: var(--color-stone-500);
    }
    p {
      font-size: 1.4rem;
      color: var(--color-grey-600);
    }
  }
  & li:first-child {
    grid-column: 1/10;
  }
  & li:nth-child(2) {
    grid-row: 2/3;
    grid-column: 2/11;
  }
  & li:last-child {
    grid-row: 3/-1;
    grid-column: 3/12;
  }
`
const About = () => {
  return (
    <Container>
      {/* Section 1 */}
      <h2>Modtag dit juridiske dokument inden for 15 minutter!</h2>
      <div>
        {/* <img src="/about-1.jpg" /> */}
        <img src="https://youcan.shop/images/new_portal_design/home/navigate-illustration-3.webp" />
        <List>
          <li>
            <span>01.</span>
            <p>{firstData[0].title}</p>
          </li>
          <li>
            <span>02.</span>
            <p>{firstData[1].title}</p>
          </li>
          <li>
            <span>03.</span>
            <p>{firstData[2].title}</p>
          </li>
          {/* {firstData.map((item,i) => (
            <li style={{gridColumn :  }}>
              <p>{item.title}</p>
            </li>
          ))} */}
        </List>
      </div>
    </Container>
  )
}

export default About
