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
      // prefer full response for diagnostics
      const response = await axiosPublic.post("/auth/login/", userData)
        // If server nested response inside `data.data`, unwrap it
        let payload = data?.data ?? data
      // If server nested response inside `data.data`, unwrap it
      const payload = data?.data ?? data

      // dispatch the payload to reducer
      dispatch(loginSuccess(payload))

      // log status and payload to help debugging in production
      // eslint-disable-next-line no-console
      console.log("login: server response.status:", response?.status)
      // stringify payload so we can see nested structure in production logs
      try {
        // eslint-disable-next-line no-console
        console.log("login: server payload:", JSON.stringify(payload))
      } catch (e) {
        // eslint-disable-next-line no-console
        
        // If payload is empty (some servers may respond with empty string),
        // try to parse the raw responseText from XHR as JSON as a fallback.
        if (!payload || payload === "") {
          try {
            const raw = response?.request?.responseText || response?.request?._response || ""
            if (raw) {
              payload = JSON.parse(raw)
              // eslint-disable-next-line no-console
              console.log("login: parsed payload from responseText", payload)
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("login: failed to parse raw responseText", e)
          }
        }
        
        // As a last-resort temporary fallback: if payload is still empty but status is 200,
        // create a minimal truthy payload so reducer stores a token and PrivateRouter won't redirect.
        if ((!payload || payload === "") && response?.status === 200) {
          // eslint-disable-next-line no-console
          console.warn(
            "login: response had empty body but status 200 — applying temporary fallback payload"
          )
          payload = { token: "__LOGIN_OK__" }
        }
        console.log("login: server payload (raw):", payload)
      }

      // Small debug toast: show payload user and store user for quick verification.
      // Do not expose full tokens — only show username and token length for safety.
      try {
        const payloadUser = payload?.user?.username || payload?.user || payload?.username || "(no-user)"
        const tokenValue = payload?.token || payload?.bearer?.accessToken || ""
        const tokenInfo = tokenValue ? `tokenLen=${tokenValue.length}` : "no-token"
        // show a short non-sensitive debug toast
        typeof toastSuccessNotify === "function" &&
          toastSuccessNotify(`DEBUG: payloadUser=${payloadUser} ${tokenInfo}`)
      } catch (e) {
        // ignore toast errors
        // eslint-disable-next-line no-console
        console.debug("toast debug failed", e)
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
