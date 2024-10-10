import { formatCurrency } from "../../utils/helpers";
import { HiOutlineArrowNarrowRight as ArrowRightIcon } from "react-icons/hi";
import { FcCheckmark as CheckMarkIcon } from "react-icons/fc";
import styled from "styled-components";
import { useCreateDocument } from "../../features/Documents/useCreateDocument";
import { useUser } from "../../features/Authentication/useUser";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  /* padding-right: 2rem; */
  padding: 3rem 2rem 0 0;
  grid-row: 1/3;
  grid-column: 2/3;
  position: relative;
  & > div {
    position: sticky;
    top: 2rem;
    overflow: hidden;
    border-radius: var(--rounded-xl);
    /* z-index: 100000; */
    /* box-shadow: var(--shadow-md); */
    /* box-shadow: var(--shadow-inner); */
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    background-color: var(--white);
    padding: 2.5rem 0 0;
    & > div:first-child {
      padding: 0 1rem 2rem;
      display: grid;
      grid-template-columns: 1fr;
      justify-items: center;
      gap: 2rem;
      & p:first-of-type {
        font-size: 2rem;
        font-weight: 500;
      }
      & p:nth-of-type(2) {
        font-weight: 700;
        font-size: 3.5rem;
      }
      & p:last-of-type {
        color: var(--color-grey-500);
        font-weight: 500;
        text-align: center;
        font-size: 1.2rem;
      }
      & > button {
        background: none;
        border: none;
        display: flex;
        gap: 1rem;
        align-items: center;
        background-color: var(--color-stone-500);
        padding: 1.5rem 3rem;
        color: var(--white);
        border-radius: var(--rounded-3xl);
      }
    }
    & > div:last-child {
      background-color: #e9f7ef;
      padding: 2rem 2.5rem;
      & > p:first-child {
        margin-bottom: 1.25rem;
        text-align: center;
      }
      & ul {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      & ul li {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 0.5rem;
        & span {
          font-weight: 500;
          font-size: 1.3rem;
        }
        & svg {
          font-size: 2rem;
        }
      }
    }
  }
  @media screen and (max-width: 56.25em) {
    grid-row: 2/3;
    grid-column: 1/-2;
    & > div {
      position: relative;
      top: unset;
    }
  }
`;

const TemplatePriceCard = ({ template }: { template: Template }) => {
  const { isLoading, createDocument } = useCreateDocument();
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  const clickHandler = () => {
    if (!isAuthenticated) {
      navigate(`/guest-document/${template.id}`);
      return;
    }

    // @ts-ignore
    if (user && user.role === "ADMIN") {
      return; // Stop further execution if the user is an admin
    }

    createDocument(template.id);
  };

  return (
    <Container>
      <div>
        <div>
          <p>Pris</p>
          <p>{formatCurrency(template.cost)}</p>
          <button
            // @ts-ignore
            disabled={isAuthenticated && user!.role === "ADMIN"}
            onClick={clickHandler}
          >
            <span>{isLoading ? "Loading..." : "Oprette dokument"}</span>
            <ArrowRightIcon />
          </button>
          <p>
            Gennemfør alle trin først, betal til sidst. Din tilfredshed er vores
            prioritet.
          </p>
        </div>
        <div>
          <p>Hvordan det virker</p>
          <ul>
            <li>
              <CheckMarkIcon />
              <span>Besvar spørgsmålene i vores online formular.</span>
            </li>
            <li>
              <CheckMarkIcon />
              <span>
                På kun 10 minutter får du et juridisk korrekt dokument.
              </span>
            </li>
            <li>
              <CheckMarkIcon />
              <span>
                Foretag ændringer i dokumentet, eller download det som PDF.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default TemplatePriceCard;
