import axios from "axios"
import { useSelector } from "react-redux"

const useAxios = () => {
  const { token } = useSelector((state) => state.auth)

  // Token gerektiren instance
  const axiosToken = axios.create({
    baseURL: "/api/v1",
  })

  // ✅ Interceptor ile Authorization header ekle
  axiosToken.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Public instance (login/register gibi)
  const axiosPublic = axios.create({
    baseURL: "/api/v1",
  })

  return { axiosToken, axiosPublic }
}

export default useAxios
