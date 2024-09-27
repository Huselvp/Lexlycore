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
import { useParams } from "react-router-dom";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import axios from "axios";
import { API } from "../../utils/constants";
import { getApiConfig } from "../../utils/constants";

import html2pdf from "html2pdf.js";

import i from "../../../public/docura-short.png";

const Questions = () => {
  const { templateId } = useParams();
  // Function to fetch template questions and generate PDF after loading
  const getTemplateQuestion = async () => {
    try {
      // Await the axios call to ensure data is loaded
      const result = await axios.get(
        `${API}/public/template/${templateId}`,
        getApiConfig()
      );

      // Log the result and handle the PDF generation once data is successfully fetched
      if (result?.data?.questions) {
        console.log(result.data.questions);
        console.log(result.data.templateName);
        handleGeneratePdf(result.data.questions, result.data.templateName, i);
      } else {
        console.log("No questions found in the response.");
      }
    } catch (err) {
      // Handle errors that might occur during the API call
      console.log("Error fetching template questions: ", err);
    }
  };

  // Function to extract both texte and text_area from questions, including nested subquestions
  function extractTextes(questions) {
    const texteArray = [];

    questions.forEach((item) => {
      // Check for texte and use it if available
      if (item.texte) {
        const updatedText = item.texte.includes("[value]")
          ? item.texte.replaceAll("[value]", item.value || "")
          : item.texte;
        texteArray.push(updatedText);
      }

      // Check for text_area and use it if available
      if (item.text_area) {
        const updatedTextArea = item.text_area.includes("[value]")
          ? item.text_area.replaceAll("[value]", item.value || "")
          : item.text_area;
        texteArray.push(updatedTextArea);
      }

      // Check if subQuestions exist and process them recursively
      if (item.subQuestions && item.subQuestions.length > 0) {
        const subQuestionTexts = extractTextes(item.subQuestions);
        texteArray.push(...subQuestionTexts);
      }
    });

    return texteArray;
  }

  // Component to extract and return raw HTML content from documentQuestions
  const DocumentQuestionsDisplay = ({ documentQuestions }) => {
    const textes = extractTextes(documentQuestions);

    // Add margin-bottom to each extracted HTML block and apply it to all children
    return textes
      .map(
        (texte) => `
        <div style="margin-bottom: 1rem; page-break-inside: avoid;">
          <div style="margin-bottom: 1rem;">${texte}</div>
        </div>
      ` // Wrap each texte in an outer div for margin and inner div for child elements
      )
      .join(""); // Return the combined HTML content as a string
  };

  // Function to convert HTML content to PDF
  const convertToPdf = (title, logo, contentHtml) => {
    // Define the header HTML, using a specific font family, smaller font size, and margin
    const header = `
    <div style="display:flex; align-items:center; justify-content:space-between; font-family: Arial, sans-serif; font-size: 12px; margin-bottom: 1rem;">
      <h2 style="font-size: 20px; font-weight:bold;">${title}</h2>
      <img src="${logo}" width="100" height="100" alt="Logo" />
    </div>`;

    // Apply the same font family and size to the entire content, adding margin between parent tags
    const content = `
    <div style="font-family: Arial, sans-serif; font-size: 12px;">
      ${header}
      ${contentHtml} <!-- The contentHtml already has the margin applied in each div -->
    </div>`;

    const options = {
      filename: "my-document.pdf",
      margin: 1,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
      pagebreak: { mode: ["css", "legacy"] }, // Enables page breaks
    };

    // Generate the PDF with the header and content included, and add page numbers
    html2pdf()
      .set(options)
      .from(content)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();

        // Add page numbers to each page
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 0.5,
            { align: "center" }
          );
        }
      })
      .save();
  };

  // Function to handle generating PDF by extracting and converting document questions to PDF
  const handleGeneratePdf = (documentQuestions, title, logo) => {
    // Generate HTML content from DocumentQuestionsDisplay
    const contentHtml = DocumentQuestionsDisplay({ documentQuestions });

    // Pass it to the convertToPdf function
    convertToPdf(title, logo, contentHtml);
  };

  // =========================================

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

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "end",
          marginTop: "2rem",
        }}
      >
        <MdOutlineRemoveRedEye
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => {
            console.log("here is me");
            getTemplateQuestion();
          }}
        />
      </div>
    </Modal>
  );
};

export default Questions;
