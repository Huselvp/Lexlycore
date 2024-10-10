import styled from "styled-components"

const Container = styled.div`
  /* background-color: var(--color-grey-50); */
  /* background-color: var(--color-stone-150); */
  background-color: var(--white);
  padding: 6rem 2rem;
  & > p:first-child {
    font-size: 2.8rem;
    font-weight: 600;
    text-align: center;
  }
  & > p:last-of-type {
    max-width: 75rem;
    text-align: center;
    margin: 0 auto;
    margin-top: 1rem;
    margin-bottom: 6rem;
    color: var(--color-grey-500);
  }
  & ul {
    display: grid;
    /* grid-template-columns: repeat(auto-fit, minmax(38rem, 1fr)); */
    grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
    gap: 2rem;
    & li {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      & h3 {
        font-size: 2rem;
      }
      & p {
        font-size: 1.4rem;
        color: var(--color-grey-500);
      }
      & img {
        height: 5rem;
        margin-right: auto;
        margin-bottom: 2rem;
      }
      & span {
        margin-bottom: 2.5rem;
        align-self: start;
        background-color: var(--color-stone-150);
        /* background-color: var(--color-grey-100); */
        border-radius: 50%;
        /* padding: 1.6rem; */
        padding: 1.25rem;
        & svg {
          color: var(--color-stone-550);
          font-size: 3rem;
        }
      }
    }
  }
  /* 800px */
  @media screen and (max-width: 50em) {
    & ul {
      justify-content: center;
      grid-template-columns: minmax(min-content, 60rem);
      gap: 3rem;
      & li {
        align-items: center;
        & img {
          margin-right: unset;
        }
        & p {
          text-align: center;
        }
      }
    }
  }
`
const Section1 = ({
  data,
  includeHeading
}: {
  data: {
    title: string
    description: string
    icon: string
  }[]
  includeHeading: boolean
}) => {
  return (
    <Container>
      {includeHeading && (
        <>
          <p>Spar tid og penge uden at gå på kompromis med kvaliteten</p>
          <p>
            Formålet er gøre komplekse juridiske kontrakter letforståelige og
            nemme at administrere. Ved hjælp af avanceret
            automatiseringsteknologi kan du bevare fokusset det rette sted
          </p>
        </>
      )}
      <ul>
        {data.map((item) => (
          <li>
         
            <img src={`/${item.icon}`} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default Section1
