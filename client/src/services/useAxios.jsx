// src/hooks/useAxios.js
import axios from "axios"
import { useSelector } from "react-redux"

const useAxios = () => {
  const { token } = useSelector((state) => state.auth)

  // BaseURL: local için proxy, production için .env
  const baseURL =
    process.env.REACT_APP_API_URL || "/api/v1"

  // Token gerektiren instance
  const axiosToken = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Interceptor ile Authorization header ekle
  axiosToken.interceptors.request.use(
    (config) => {
      console.log("Redux token:", token) // 👀 Redux’tan token geliyor mu?
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log("Auth header set:", config.headers.Authorization) // 👀 Header’a eklendi mi?
      } else {
        console.warn("No token found, request without Authorization header")
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Public instance (login/register gibi)
  const axiosPublic = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  return { axiosToken, axiosPublic }
}

export default useAxios
