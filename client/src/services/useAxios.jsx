import axios from "axios"
import { useSelector } from "react-redux"

const useAxios = () => {
  const { token } = useSelector((state) => state.auth)

  // Use REACT_APP_BASE_URL when provided (baked into the build),
  // otherwise fall back to same-origin API under `/api/v1`.
  const baseURL = process.env.REACT_APP_BASE_URL || '/api/v1'

  const axiosToken = axios.create({
    baseURL,
    headers: { Authorization: `Token ${token}` },
  })

  const axiosPublic = axios.create({
    baseURL,
  })

  return { axiosToken, axiosPublic }
}

export default useAxios
