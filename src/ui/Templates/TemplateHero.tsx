import styled from "styled-components"
import { FcCheckmark as CheckMarkIcon } from "react-icons/fc"

const Container = styled.div`
  grid-row: 1/2;
  grid-column: 1/-1;
  min-height: 45rem;
  background-color: var(--white);
  /* gap: 2rem; */
  padding: 2rem;
  padding-bottom: 8rem;
  border-radius: var(--rounded-2xl);
  background: linear-gradient(to top, var(--color-stone-550), transparent),
    url("/template.jpg") no-repeat center center / cover;
  /* background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
      url("/template.jpg") no-repeat center center / cover; */
  color: var(--white);

  & > div {
    height: 100%;
    display: grid;
    grid-template-columns: calc(100% - 35rem);
    gap: 3rem;
    & > h3 {
      color: currentColor;
      font-size: 5rem;
    }
    & > p {
      font-size: 1.6rem;
      font-weight: 500;
    }
    & ul {
      margin-top: 2rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      align-self: end;
      & li {
        display: grid;
        grid-template-columns: max-content 1fr;
        grid-template-rows: min-content 1fr;
        gap: 0.25rem 1rem;
        & span {
          grid-column: 2/3;
          grid-row: 1/2;
          font-weight: 500;
        }
        & p {
          grid-row: 2/3;
          grid-column: 2/3;
          color: var(--color-grey-200);
        }
        & div {
          width: 2.5rem;
          height: 2.5rem;
          background-color: var(--white);
          border-radius: 50%;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        & svg {
          font-size: 3rem;
        }
      }
    }
  }
  @media screen and (max-width: 56.25em) {
    & > div {
      grid-template-columns: 1fr;
      & > h3 {
        font-size: 4rem;
      }
    }
  }
  @media screen and (max-width: 31.25em) {
    & > div ul {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }
`
const TemplateHero = ({ template }: { template: Template }) => {
  return (
    <Container>
      <div>
        <h3>{template.templateName}</h3>
        <p>{template.templateDescription}</p>
        <ul>
          <li>
            <div>
              <CheckMarkIcon />
            </div>
            <span>Tager 10 minutter</span>
            <p>Kan downloades med det samme</p>
          </li>
          <li>
            <div>
              <CheckMarkIcon />
            </div>
            <span>Genereres automatisk</span>
            <p>Skræddersyet ud fra dine svar</p>
          </li>
          <li>
            <div>
              <CheckMarkIcon />
            </div>
            <span>Yderligere ekspertrådgivning</span>
            <p>Vi finjusterer dokumentet for dig</p>
          </li>
        </ul>
      </div>
    </Container>
  )
}

export default TemplateHero
