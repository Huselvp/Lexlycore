import UsersTable from "../../features/Users/UsersTable"
import { useUsers } from "../../features/Users/useUsers"
import FeaturesHeader from "../../ui/FeaturesHeader"
import Spinner from "../../ui/Spinner"

const Users = () => {
  const { isLoading, isError } = useUsers()
  if (isLoading) <Spinner />
  if (isError) <div>Something went w rong</div>
  return (
    <>
      <FeaturesHeader>
        <h2>Users</h2>
      </FeaturesHeader>
      <UsersTable />
    </>
  )
}

export default Users
