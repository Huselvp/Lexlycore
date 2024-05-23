import styled from "styled-components"

const ConfirmDelete = styled.div`
  /* width: minmax(max-content, 50rem); */
  width: 70vw;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  /* 500px */
  @media screen and (max-width: 31.25em) {
    width: 85vw;
  }
  & h3 {
    text-align: left;
  }
  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`

export default ConfirmDelete
// import styled from "styled-components"
// import Button from "./Button"

// const StyledConfirmDelete = styled.div`
//   width: 40rem;
//   display: flex;
//   flex-direction: column;
//   gap: 1.2rem;
//   & h3 {
//     text-align: left;
//   }
//   & p {
//     color: var(--color-grey-500);
//     margin-bottom: 1.2rem;
//   }

//   & div {
//     display: flex;
//     justify-content: flex-end;
//     gap: 1.2rem;
//   }
// `
// type PropsType = {
//   resourceName: string
//   onConfirm: () => void
//   disabled: boolean
//   onCloseModal?: () => void
// }
// function ConfirmDelete({
//   resourceName,
//   onConfirm,
//   disabled,
//   onCloseModal
// }: PropsType) {
//   return (
//     <StyledConfirmDelete>
//       <h3>Delete {resourceName}</h3>
//       <p>
//         Are you sure you want to delete this {resourceName} permanently? This
//         action cannot be undone.
//       </p>

//       <div>
//         <Button
//           variation="secondary"
//           size="medium"
//           disabled={disabled}
//           onClick={onCloseModal}
//         >
//           Cancel
//         </Button>
//         <Button
//           variation="danger"
//           size="medium"
//           disabled={disabled}
//           onClick={onConfirm}
//         >
//           Delete
//         </Button>
//       </div>
//     </StyledConfirmDelete>
//   )
// }

// export default ConfirmDelete
