import { useEffect } from "react"
import { useUser } from "../features/Authentication/useUser"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import Spinner from "./Spinner"

const protectedRoute = ({ userRole }: { userRole: "ADMIN" | "SUSER" }) => {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated, user } = useUser()
  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login")
  }, [isLoading, isAuthenticated])
  if (isLoading) return <Spinner />
  if (!isLoading && !isAuthenticated) return null
  if (user?.role !== userRole) return <Navigate to="/pageNotFound" />
  return <Outlet />
}

export default protectedRoute
