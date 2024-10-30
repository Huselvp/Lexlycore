import styled from "styled-components";
import Logo from "../../ui/Logo";
import { FaSave as SaveIcon } from "react-icons/fa";
import { useAddUpdateDocumentQuestion } from "./useAddUpdateDocumentQuestion";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/helpers";

const Header = styled.div`
  background-color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-200);
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 400;
  button {
    color: var(--color-stone-500);
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid currentColor;
    padding: 1rem;
    border-radius: var(--rounded);
    font-weight: 500;
    &:hover {
      color: var(--color-stone-600);
    }
  }
`;

const DocumentHeader = ({
  overviewData,
}: {
  isDraft: boolean;
  overviewData: {
    questionText: string;
    questionId: number;
    value: string | number;
    active: boolean;
  }[];
}) => {
  const { isLoading } = useAddUpdateDocumentQuestion();
  const navigate = useNavigate();

  const token = getToken();

  const clickHandler = () => {
    localStorage.setItem("continue-later", JSON.stringify(overviewData));

    console.log(overviewData, "############");

    navigate("/u/documents");
  };

  return (
    <Header>
      <Logo />
      {token !== "" ? (
        <button disabled={isLoading} onClick={clickHandler}>
          <span>{isLoading ? "Loading..." : "Continue later"}</span>
          <SaveIcon />
        </button>
      ) : (
        ""
      )}
    </Header>
  );
};

export default DocumentHeader;
