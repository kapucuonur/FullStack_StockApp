import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify"
import {
  fetchFail,
  fetchStart,
  loginSuccess,
  registerSuccess,
  logoutSuccess,
} from "../features/authSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import useAxios from "./useAxios"

const useApiRequest = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { axiosToken, axiosPublic } = useAxios()

  // LOGIN
  const login = async (userData) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosPublic.post("/auth/login", userData)
      dispatch(loginSuccess(data))
      toastSuccessNotify("Login işlemi başarılı")
      navigate("/stock")
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Login başarısız oldu")
      console.error(error)
    }
  }

  // REGISTER
  const register = async (userInfo) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosPublic.post("/auth/register", userInfo)
      dispatch(registerSuccess(data))
      toastSuccessNotify("Register işlemi başarılı")
      navigate("/stock")
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Register başarısız oldu")
      console.error(error)
    }
  }

  // LOGOUT
  const logout = async () => {
    dispatch(fetchStart())
    try {
      await axiosToken.get("/auth/logout")
      dispatch(logoutSuccess())
      toastSuccessNotify("Logout başarılı")
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Logout başarısız oldu")
      console.error(error)
    }
  }

  return { login, register, logout }
}

export default useApiRequest
