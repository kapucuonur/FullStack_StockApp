import axios from "axios"
import { useSelector } from "react-redux"

const useAxios = () => {
  const { token } = useSelector((state) => state.auth)

  // BaseURL sadece relative path → CRA proxy dev ortamında yönlendirir
  const baseURL = "/api/v1"

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
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
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
