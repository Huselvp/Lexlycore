import { useNavigate } from "react-router-dom";
import QuestionsTable from "../../features/Templates/Questions/QuestionsTable";
import Button from "../../ui/Button";
import FeaturesHeader from "../../ui/FeaturesHeader";
import Modal from "../../ui/Modal";
import GoBackButton from "../../ui/GoBackButton";
import { useTemplate } from "../../features/Templates/useTemplate";
import Spinner from "../../ui/Spinner";
import ErrorMessage from "../../ui/ErrorMessage";
import { useEffect, useState } from "react";

const Questions = () => {
  // const { templateId } = useParams()
  const [depth, setDepth] = useState(() => {
    return localStorage.getItem("depth") || "";
  });

  useEffect(() => {
    console.log(depth, "i am the test [|||||||||||||||||||");
  }, [depth]);

  const navigate = useNavigate();
  const { isLoading, isError, template } = useTemplate();
  if (isLoading) return <Spinner />;
  if (isError || !template)
    return <ErrorMessage message="No template could be found." />;
  return (
    <Modal>
      <GoBackButton />
      <FeaturesHeader>
        <h2>Questions</h2>
        <Button
          size="medium"
          variation="priamry"
          onClick={() => navigate("addQuestion")}
        >
          Add Question
        </Button>
      </FeaturesHeader>
      <div style={{ marginBottom: "3rem" }}>
        <h5 style={{ marginBottom: "1rem" }}>
          Each color represents a subquestion level.
        </h5>
        {/* <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF5733",
              }}
            ></div>
            <p>Level 1</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#3357FF",
              }}
            ></div>
            <p>Level 2</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF33A6",
              }}
            ></div>
            <p>Level 3</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FFD133",
              }}
            ></div>
            <p>Level 4</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#8C33FF",
              }}
            ></div>
            <p>Level 5</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#33FFF5",
              }}
            ></div>
            <p>Level 6</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF8C33",
              }}
            ></div>
            <p>Level 7</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#33FF8C",
              }}
            ></div>
            <p>Level 8</p>
          </div>
        </div> */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF5733",
              }}
            ></div>
            <p>Level 1</p>
          </div>
          ,
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#3357FF",
              }}
            ></div>
            <p>Level 2</p>
          </div>
          ,
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF33A6",
              }}
            ></div>
            <p>Level 3</p>
          </div>
          ,
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FFD133",
              }}
            ></div>
            <p>Level 4</p>
          </div>
          ,
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#8C33FF",
              }}
            ></div>
            <p>Level 5</p>
          </div>
          ,
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#33FFF5",
              }}
            ></div>
            <p>Level 6</p>
          </div>
          ,
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF8C33",
              }}
            ></div>
            <p>Level 7</p>
          </div>
          ,
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#33FF8C",
              }}
            ></div>
            <p>Level 8</p>
          </div>
        </div>
      </div>
      <QuestionsTable />
    </Modal>
  );
};

export default Questions;
