// import axios from "axios"
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify"
import {
  fetchFail,
  fetchStart,
  loginSuccess,
  registerSuccess,
  logoutSuccess,
} from "../features/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import useAxios from "./useAxios"
import store from "../app/store"

//?Custom hook
//? Eger uygulamanın her yerinde kullanmak için bazı fonksiyonlara ihtyaç varsa  ve bu fonksiyonlar içerisinde custom hook'ların ( useSelector, useDispatch,useNavigate etc.) kullanılması gerekiyorsa o Zaman çözüm Bu dosyayı custom hook'a çevirmektir.

const useApiRequest = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { axiosToken, axiosPublic } = useAxios()
  // const { token } = useSelector((state) => state.auth)
  const login = async (userData) => {
    //   const BASE_URL = "https://10001.fullstack.clarusway.com"

    dispatch(fetchStart())
    try {
      // const { data } = await axios.post(
      //   `${process.env.REACT_APP_BASE_URL}/auth/login`,
      //   userData
      // )
      const { data } = await axiosPublic.post("/auth/login/", userData)
      dispatch(loginSuccess(data))

      // log payload to help debugging in production
      // eslint-disable-next-line no-console
      console.log("login: server payload:", data)

      // Small debug toast: show payload user and store user for quick verification.
      // Do not expose full tokens — only show username and token length for safety.
      try {
        const payloadUser = data?.user?.username || data?.user || data?.username || "(no-user)"
        const tokenValue = data?.token || data?.bearer?.accessToken || ""
        const tokenInfo = tokenValue ? `tokenLen=${tokenValue.length}` : "no-token"
        // show a short non-sensitive debug toast
        // eslint-disable-next-line no-unused-expressions
        typeof toastSuccessNotify === 'function' && toastSuccessNotify(`DEBUG: payloadUser=${payloadUser} ${tokenInfo}`)
      } catch (e) {
        // ignore toast errors
        // eslint-disable-next-line no-console
        console.debug('toast debug failed', e)
      }

      // Wait briefly for reducer/persist updates (small retry loop) before navigating.
      const maxChecks = 5
      let ok = false
      for (let i = 0; i < maxChecks; i++) {
        const currentUser = store.getState().auth.user
        if (currentUser) {
          ok = true
          break
        }
        // small delay
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 100))
      }

      toastSuccessNotify("Login işlemi başarılı")
      if (ok) navigate("/stock")
      else {
        // fallback navigate anyway but warn in console
        // eslint-disable-next-line no-console
        console.warn("Login succeeded but auth.user was not set in store before navigation. Proceeding to /stock anyway.")
        navigate("/stock")
      }
      return true
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Login başarısız oldu")
      console.log(error)
      return false
    }
  }

  const register = async (userInfo) => {
    dispatch(fetchStart())
    try {
      // const { data } = await axios.post(
      //   `${process.env.REACT_APP_BASE_URL}/users/`,
      //   userInfo
      // )
      const { data } = await axiosPublic.post("/users/", userInfo)
      dispatch(registerSuccess(data))
      navigate("/stock")
    } catch (error) {
      dispatch(fetchFail())
    }
  }
  const logout = async () => {
    dispatch(fetchStart())
    try {
      // await axios(`${process.env.REACT_APP_BASE_URL}/auth/logout`, {
      //   headers: { Authorization: `Token ${token}` },
      // })
      await axiosToken.get("/auth/logout")
      dispatch(logoutSuccess())
    } catch (error) {
      dispatch(fetchFail())
    }
  }

  return { login, register, logout }
}

export default useApiRequest
