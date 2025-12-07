import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRouter = () => {
  const { user, token } = useSelector((state) => state.auth)

  // Allow access if we have either a user or a token (some payloads may return token only)
  return user || token ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRouter
