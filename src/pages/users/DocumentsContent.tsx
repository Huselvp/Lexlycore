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
import { useGenerateDocument } from "../../features/Documents/useGenerateDocument";
import { useInitiatePayment } from "../../features/Payment/useInitiatePayment";
import { useNavigate } from "react-router-dom";

const Items = styled.ul`
  display: grid;
  /* grid-template-columns: repeat(3, 1fr); */
  grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
  grid-auto-rows: 30rem;
  gap: 1.5rem;

  & > li {
    position: relative;
    background-color: var(--white);
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
  const { isLoading: isGeneratingDocument, generateDocument } =
    useGenerateDocument();
  const { documents } = useDocuments();
  const { isLoading: isInitiatingPayment, initiatePayment } =
    useInitiatePayment();
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "draft">(
    "all"
  );

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
                        <Menus.Button
                          icon={<HiMiniDocumentArrowDown />}
                          onClick={() =>
                            generateDocument({
                              documentId: document.id,
                              templateId: document.template.id,
                              templateName: document.template.templateName,
                            })
                          }
                        >
                          {isGeneratingDocument ? "Loading..." : "Download"}
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
