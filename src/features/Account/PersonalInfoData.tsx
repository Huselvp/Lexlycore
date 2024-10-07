import styled from "styled-components"
import Form from "../../ui/AuthForm"
import Button from "../../ui/Button"
import Row from "../../ui/Row"
import { useUser } from "../Authentication/useUser"
import { useUpdatePersonalData } from "./useUpdatePersonalData"
import { FormEventHandler, useState } from "react"

const Container = styled.div`
  padding: 2.4rem 4rem;
  form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem 3rem;
    & > button {
      /* justify-self: start;
      text-decoration: underline;
      background: none;
      border: none;
      color: var(--color-stone-700);
      font-weight: 500;
      font-size: 1.3rem; */
    }
    & > div:has(img) {
      grid-column: 1/-1;
      margin-top: 2rem;
      margin-bottom: 3rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 2rem;
      div {
        position: relative;
        width: 15rem;
        height: 15rem;
        input {
          position: absolute;
          visibility: hidden;
          width: 0;
          height: 0;
        }
        label {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 3.5rem;
          height: 3.5rem;
          background-color: var(--color-stone-450);
          box-shadow: var(--shadow-md);
          color: var(--white);
          position: absolute;
          right: 0.5rem;
          bottom: 0.25rem;
          &:hover {
            background-color: var(--color-stone-500);
          }
          svg {
          }
        }
      }
      img {
        border-radius: 50%;
        display: block;
        border-radius: 50%;
        width: 15rem;
        height: 15rem;
        object-fit: cover;
        box-shadow: var(--shadow);
      }
    }
    & > div:last-child {
      margin-top: 3rem;
      grid-column: 1/-1;
    }
    @media screen and (max-width: 25em) {
      /* 400px */
      grid-template-columns: 1fr;
    }
  }
`
const FormRow = styled(Form.Row)``

const PersonalInfoData = () => {
  const { user } = useUser()
  const { isLoading, updatePersonalData } = useUpdatePersonalData()
  const [username, setUsername] = useState(user?.username || "")
  const [firstname, setFirstname] = useState(user?.firstname || "")
  const [lastname, setLastname] = useState(user?.lastname || "")
  const [phonenumber, setPhonenumber] = useState(user?.phonenumber || "")
  const [description, setDescription] = useState(user?.description || "")
  const [town, setTown] = useState(user?.town || "")
  const [country, setCountry] = useState(user?.country || "")
  const [zipcode, setZipcode] = useState(user?.zipcode || "")
  const [address, setAddress] = useState(user?.adress || "")
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    updatePersonalData(
      {
        username,
        firstname,
        lastname,
        phonenumber,
        description,
        town,
        country,
        zipcode: +zipcode,
        adress: address
      },
      {
        onError: () => {
          setUsername(user?.username || "")
          setFirstname(user?.firstname || "")
          setLastname(user?.lastname || "")
          setPhonenumber(user?.phonenumber || "")
          setDescription(user?.description || "")
          setTown(user?.town || "")
          setCountry(user?.country || "")
          setZipcode(user?.zipcode || "")
          setAddress(user?.adress || "")
        }
      }
    )
  }
  return (
    <Container>
      <form onSubmit={onSubmit}>
        
        <FormRow>
          <Form.Label>Username</Form.Label>
          <Form.Input
            disabled={isLoading}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Form.Label>First name</Form.Label>
          <Form.Input
            disabled={isLoading}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Form.Label>Last name</Form.Label>
          <Form.Input
            disabled={isLoading}
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Form.Label>Phone number</Form.Label>
          <Form.Input
            type="number"
            disabled={isLoading}
            value={phonenumber}
            onChange={(e) => setPhonenumber(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Form.Label>Address</Form.Label>
          <Form.Input
            disabled={isLoading}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Form.Label>Country</Form.Label>
          <Form.Input
            disabled={isLoading}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Form.Label>City</Form.Label>
          <Form.Input
            disabled={isLoading}
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Form.Label>Zip code</Form.Label>
          <Form.Input
            disabled={isLoading}
            type="number"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
        </FormRow>
        <FormRow style={{ gridColumn: "1/-1" }}>
          <Form.Label>Bio</Form.Label>
          <Form.Textarea
            disabled={isLoading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormRow>
        <Row direction="row" gap="2rem" justify="flex-end">
          <Button
            size="medium"
            variation="priamry"
            type="submit"
            disabled={isLoading}
            style={{ paddingRight: "3rem", paddingLeft: "3rem" }}
          >
            Save changes
          </Button>
        </Row>
      </form>
    </Container>
  )
}

export default PersonalInfoData
