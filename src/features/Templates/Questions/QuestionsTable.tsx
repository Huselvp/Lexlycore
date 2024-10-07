import Menus from "../../../ui/Menus";
import Table from "../../../ui/Table";
import { useTemplate } from "../useTemplate";
import QuestionsRow from "./QuestionsRow";
import { useEffect, useState } from "react";
import { API, getApiConfig } from "../../../utils/constants";
import axios from "axios";

const QuestionsTable = () => {
  const { template } = useTemplate();
  const questions = template!.questions.sort((a, b) => a.position - b.position);

  const [questionOrderTest, setQuestionOrderTest] = useState(questions);
  const questionIds = questionOrderTest.map((q) => q.id);

  const handleReorder = (newOrder) => {
    setQuestionOrderTest(newOrder);
  };

  useEffect(() => {
    const reorderQuestions = async (questionids: number[]) => {
      try {
         await axios.put(
          `${API}/admin/question/reorder`,
          questionids,
          getApiConfig()
        );
      } catch (error) {
        console.error("Error reordering questions:", error);
      }
    };

    reorderQuestions(questionIds);
  }, [questionOrderTest, questionIds]);

  useEffect(() => {
    setQuestionOrderTest(questions);
  }, [questions]);

  return (
    <Menus>
      <Table columns="1.5rem 1fr 1fr 3rem">
        <Table.Header>
          <div>#</div>
          <div>Question</div>
          <div>Description</div>
          <div></div>
        </Table.Header>
        <Table.OrderedBody
          data={questionOrderTest}
          render={(question) => {
            return <QuestionsRow key={question.id} question={question} />;
          }}
          onReorder={handleReorder}
        />
      </Table>
    </Menus>
  );
};

export default QuestionsTable;
