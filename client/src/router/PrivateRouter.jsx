import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRouter = () => {
  const { user, token } = useSelector((state) => state.auth)

  // Debug log to inspect why PrivateRouter may block navigation
  // eslint-disable-next-line no-console
  console.log("PrivateRouter: auth.user, auth.token ->", user, token)

  // Allow access if we have either a user or a token (some payloads may return token only)
  return user || token ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRouter
