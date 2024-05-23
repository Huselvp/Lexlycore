import styled from "styled-components"

const Container = styled.div`
  height: 80dvh;
  display: grid;
  place-content: center;
  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    & img {
      width: 4.5rem;
    }
    & p {
    }
  }
`

const ErrorMessage = ({ message }: { message?: string }) => {
  return (
    <Container>
      <div>
        <img
          alt="error emoji"
          src="https://loor.netlify.app/emojis/error.png"
        />
        <p>
          {typeof message === "undefined"
            ? "Something went wrong, Please try again later."
            : message}
        </p>
      </div>
    </Container>
  )
}

export default ErrorMessage
