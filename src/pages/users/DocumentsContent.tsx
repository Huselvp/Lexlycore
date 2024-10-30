import { useDocuments } from "../../features/Documents/useDocuments";
import styled from "styled-components";
import { HiMiniDocumentArrowDown, HiPencil } from "react-icons/hi2";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import FilterBanner from "../../ui/FilterBanner";
import { useState } from "react";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDeleteDocument from "../../features/Documents/ConfirmDeleteDocument";
// import { useGenerateDocument } from "../../features/Documents/useGenerateDocument";
import { useInitiatePayment } from "../../features/Payment/useInitiatePayment";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

import { API } from "../../utils/constants";
import { getApiConfig } from "../../utils/constants";
import axios from "axios";

import i from "../../../public/docura-short.png";

const Items = styled.ul`
  display: grid;
  /* grid-template-columns: repeat(3, 1fr); */
  grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
  grid-auto-rows: 30rem;
  gap: 1.5rem;

  & > li {
    position: relative;
    background-color: var(--white);
    border: 1px solid #b6ae92;
    padding: 1.75rem;
    border-radius: var(--rounded-xl);
    box-shadow: var(--shadow-sm);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content min-content 1fr min-content;
    gap: 1.5rem;
    & > div {
      display: grid;
      grid-template-columns: 1fr max-content;
      align-items: center;
      & svg {
        font-size: 2.5rem;
      }
    }
  }
`;

const Status = styled.p<{ status: "paid" | "unpaid" | "draft" }>`
  justify-self: start;
  /* background-color: var(--color-yellow-100); */
  /* decoration-slate-50	text-decoration-color: #f8fafc; */
  background-color: ${(props) =>
    props.status === "paid"
      ? "var(--color-green-100)"
      : props.status === "unpaid"
      ? "var(--color-yellow-100)"
      : "var(--color-silver-100)"};
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  font-size: 1.2rem;
  border-radius: var(--rounded-3xl);
`;
const TemplateName = styled.p`
  font-weight: 500;
  font-size: 1.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Change this value to the number of lines you want to display */
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
`;

const TemplatePrice = styled.p`
  justify-self: end;
  font-weight: 500;
`;
const TemplateDes = styled.p`
  align-self: start;
  font-size: 1.4rem;
  color: var(--color-grey-500);
  display: -webkit-box;
  -webkit-line-clamp: 5; /* Change this value to the number of lines you want to display */
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
`;
const NoData = styled.p``;

const DocumentsContent = () => {
  const navigate = useNavigate();
  // const { isLoading: isGeneratingDocument, generateDocument } =
  //   useGenerateDocument();
  const { documents } = useDocuments();
  const { isLoading: isInitiatingPayment, initiatePayment } =
    useInitiatePayment();
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "draft">(
    "all"
  );

  // =============

  const getPDF = async (id, title) => {
    try {
      await axios
        .get(`${API}/suser/values/${id}`, getApiConfig())
        .then((result) => {
          // Update state
          handleGeneratePdf(result.data, title, i); // Pass the result directly to the function
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to extract both texte and value from questions, including nested subquestions
  function extractTextes(questions) {
    const texteArray = [];

    // Recursive function to traverse questions and nested subquestions
    function traverseQuestions(questions) {
      questions.forEach((item) => {
        if (item.question) {
          // If 'texte' exists, replace [value] with the actual value
          if (item.question.texte) {
            const updatedText = item.question.texte.replaceAll(
              "[value]",
              item.value
            );
            texteArray.push(updatedText);
          }

          // If 'text_area' exists, replace [value] with the actual value
          if (item.question.text_area) {
            const updatedText = item.question.text_area.replaceAll(
              "[value]",
              item.value
            );
            texteArray.push(updatedText);
          }
        }

        // If there are nested subquestions, recurse into them
        if (item.subquestions && item.subquestions.length > 0) {
          traverseQuestions(item.subquestions);
        }
      });
    }

    // Start traversing the main questions
    traverseQuestions(questions);

    return texteArray;
  }

  // Component to extract and return raw HTML content from documentQuestions
  const DocumentQuestionsDisplay = ({ documentQuestions }) => {
    const textes = extractTextes(documentQuestions);

    // Apply margin-bottom: 1rem to each extracted HTML block
    return textes
      .map(
        (texte) => `<div>${texte}</div>` // Wrap each texte inside a div
      )
      .join(""); // Return the combined HTML content as string
  };

  // Function to convert HTML content to PDF
  // const convertToPdf = (title, logo, contentHtml) => {
  //   // Define the header HTML, using a specific font family, smaller font size, and margin
  //   const header = `
  //     <div style="display:flex; align-items:center; justify-content:space-between; font-family: Arial, sans-serif; font-size: 12px; margin-bottom: 1rem;">
  //       <h2 style="font-size: 16px;">${title}</h2>
  //       <img src="${logo}" width="100" height="100" alt="Logo" />
  //     </div>`;

  //   // Apply the same font family and size to the entire content, adding margin between parent tags
  //   const content = `
  //     <div style="font-family: Arial, sans-serif; font-size: 12px;">
  //       ${header}
  //       <div style="margin-bottom: 1rem;">${contentHtml}</div>
  //     </div>`;

  //   const options = {
  //     filename: "my-document.pdf",
  //     margin: 1,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2, useCORS: true },
  //     jsPDF: {
  //       unit: "in",
  //       format: "letter",
  //       orientation: "portrait",
  //     },
  //     pagebreak: { mode: ["avoid-all", "css", "legacy"] }, // Enable page breaks for long content
  //   };

  //   // Generate the PDF with the header and content included
  //   html2pdf().set(options).from(content).save();
  // };

  // const convertToPdf = (title, logo, contentHtml) => {
  //   // Define the header HTML
  //   const header = `
  //     <div style="display:flex; align-items:center; justify-content:space-between; font-family: Arial, sans-serif; font-size: 12px; margin-bottom: 1rem;">
  //       <h2 style="font-size: 16px;">${title}</h2>
  //       <img src="${logo}" width="100" height="100" alt="Logo" />
  //     </div>`;

  //   // Define the footer HTML with dynamic page numbers using a placeholder
  //   const footer = `
  //     <div style="position: fixed; bottom: 0; width: 100%; text-align: center; font-family: Arial, sans-serif; font-size: 10px; color: #666;">
  //       Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  //     </div>`;

  //   // Wrap content in a div with specific styling for PDF generation
  //   const content = `
  //     <div style="font-family: Arial, sans-serif; font-size: 12px;">
  //       ${header}
  //       <div style="margin-bottom: 1rem;">${contentHtml}</div>
  //       ${footer}
  //     </div>`;

  //   // Options with page break handling
  //   const options = {
  //     filename: "my-document.pdf",
  //     margin: [0.5, 0.5, 1, 0.5], // Adjust bottom margin for footer
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2, useCORS: true },
  //     jsPDF: {
  //       unit: "in",
  //       format: "letter",
  //       orientation: "portrait",
  //     },
  //     pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  //   };

  //   // Generate the PDF with the header, content, and footer included
  //   html2pdf()
  //     .set(options)
  //     .from(content)
  //     .toPdf()
  //     .get("pdf")
  //     .then((pdf) => {
  //       // Set total page count
  //       const totalPages = pdf.internal.getNumberOfPages();
  //       for (let i = 1; i <= totalPages; i++) {
  //         pdf.setPage(i);
  //         pdf.text(
  //           `Page ${i} of ${totalPages}`,
  //           pdf.internal.pageSize.width / 2,
  //           pdf.internal.pageSize.height - 0.5, // Adjust footer position
  //           { align: "center" }
  //         );
  //       }
  //     })
  //     .save();
  // };

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

  const handleGeneratePdf = (documentQuestions, title, logo) => {
    // Generate HTML content from DocumentQuestionsDisplay
    const contentHtml = DocumentQuestionsDisplay({ documentQuestions });

    // Pass it to the convertToPdf function
    convertToPdf(title, logo, contentHtml);
  };

  const data =
    filter === "draft"
      ? documents.filter((doc) => doc.draft)
      : filter === "unpaid"
      ? documents.filter((doc) => !doc.draft && !doc.paymentStatus)
      : filter === "paid"
      ? documents.filter((doc) => !doc.draft && doc.paymentStatus)
      : documents;

  return (
    <>
      <FilterBanner setFilter={setFilter} />
      <Modal>
        <Menus>
          {data.length > 0 ? (
            <Items>
              {data.map((document) => (
                <li key={document.id} id={`menus-row--${document.id}`}>
                  <div>
                    {document.draft && <Status status="draft">Draft</Status>}
                    {!document.draft && !document.paymentStatus && (
                      <Status status="unpaid">Unpaid</Status>
                    )}
                    {!document.draft && document.paymentStatus && (
                      <Status status="paid">Paid</Status>
                    )}
                    <Menus.Toggle
                      id={String(document.id)}
                      horizontalIcon={true}
                    />

                    {/*  */}
                    <Menus.List id={String(document.id)}>
                      {document.draft && (
                        <Menus.Button
                          icon={<HiPencil />}
                          onClick={() =>
                            navigate(
                              `/editDocument/${document.template.id}/${document.id}`
                            )
                          }
                        >
                          Continue
                        </Menus.Button>
                      )}
                      {!document.draft && document.paymentStatus && (
                        // <Menus.Button
                        //   icon={<HiMiniDocumentArrowDown />}
                        //   onClick={() =>
                        //     generateDocument({
                        //       documentId: document.id,
                        //       templateId: document.template.id,
                        //       templateName: document.template.templateName,
                        //     })
                        //   }
                        // >
                        //   {isGeneratingDocument ? "Loading..." : "Download"}
                        // </Menus.Button>
                        <Menus.Button
                          icon={<HiMiniDocumentArrowDown />}
                          onClick={() => {
                            getPDF(document.id, document.template.templateName);
                          }}
                        >
                          Download
                        </Menus.Button>
                      )}

                      {!document.draft && !document.paymentStatus && (
                        <Menus.Button
                          onClick={() =>
                            initiatePayment({
                              templateId: document.template.id,
                              documentId: document.id,
                            })
                          }
                          icon={<HiMiniShoppingCart />}
                        >
                          {isInitiatingPayment ? "Loading..." : "Checkout"}
                        </Menus.Button>
                      )}
                      <Modal.Open opens={`delete-document-${document.id}`}>
                        <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                      </Modal.Open>
                    </Menus.List>
                    {/*  */}

                    <Modal.Window name={`delete-document-${document.id}`}>
                      <ConfirmDeleteDocument documentId={document.id} />
                    </Modal.Window>
                  </div>
                  <TemplateName>{document.template.templateName}</TemplateName>
                  <TemplateDes>
                    {document.template.templateDescription}
                  </TemplateDes>
                  <TemplatePrice>
                    {formatCurrency(document.template.cost)}
                  </TemplatePrice>
                </li>
              ))}
            </Items>
          ) : (
            <NoData>No documents found.</NoData>
          )}
        </Menus>
      </Modal>
    </>
  );
};

export default DocumentsContent;
