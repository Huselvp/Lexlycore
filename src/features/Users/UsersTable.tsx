import { useState } from "react"
import Table from "../../ui/Table"
import UsersRow from "./UsersRow"
import { useUsers } from "./useUsers"
import styled from "styled-components"
import Form from "../../ui/AuthForm"
import { useWindowListener } from "../../hooks/useWindowListener"

const Select = styled(Form.Select)`
  padding: 0.5rem 1.2rem;
`

const UsersTable = () => {
  const { windowWidth } = useWindowListener()
  const { users } = useUsers()
  const [filteredBy, setFilteredBy] = useState<"all" | "admins" | "users">(
    "all"
  )
  const data: User[] =
    filteredBy === "admins"
      ? users.filter((u) => u.role === "ADMIN")
      : filteredBy === "users"
      ? users.filter((u) => u.role === "SUSER")
      : users
  const columns =
    windowWidth >= 500 ? "2rem 1.4fr .7fr .7fr" : "2rem 1.4fr .7fr"
  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <Select
          defaultValue={"all"}
          onChange={(e) =>
            setFilteredBy(e.target.value as "all" | "admins" | "users")
          }
        >
          <option value="all">All</option>
          <option value="admins">Admins</option>
          <option value="users">Users</option>
        </Select>
      </div>
      <Table columns={columns}>
        <Table.Header>
          <div></div>
          <div>User</div>
          {windowWidth >= 500 && <div>Country</div>}
          <div>Phone number</div>
        </Table.Header>
        <Table.Body
          data={data}
          render={(user) => (
            <UsersRow
              key={user.userId}
              user={user}
              onMobile={windowWidth < 500}
            />
          )}
        ></Table.Body>
      </Table>
    </>
  )
}

export default UsersTable
