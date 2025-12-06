// useApiRequest.js

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

//?Custom hook
const useApiRequest = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { axiosToken, axiosPublic } = useAxios()
 
  const login = async (userData) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosPublic.post("/auth/login/", userData)
      
      // 🚨 GÜVENLİK DÜZELTMESİ: Veriyi Redux'a göndermeden önce yapıyı kontrol et
      // Backend'den gelen veri bazen 'data' bazen de 'user' içinde olabilir
      const payloadData = data?.user || data?.data || data; 

      if (payloadData && payloadData.username) {
        dispatch(loginSuccess(data)) // Tüm data nesnesini Redux'a gönder
        toastSuccessNotify("Login işlemi başarılı")
        navigate("/stock")
      } else {
        // Eğer kullanıcı adı eksikse, kullanıcıya bildirim göster.
        dispatch(fetchFail());
        toastErrorNotify("Login başarılı ancak kullanıcı verisi eksik.");
        console.error("Backend yanıtında kullanıcı adı eksik:", data);
      }

    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Login başarısız oldu")
      console.log(error)
    }
  }

  const register = async (userInfo) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosPublic.post("/users/", userInfo)
      
      // 🚨 GÜVENLİK DÜZELTMESİ: Yapı kontrolü
      const payloadData = data?.user || data?.data || data;

      if (payloadData && payloadData.username) {
        dispatch(registerSuccess(data)) // Tüm data nesnesini Redux'a gönder
        toastSuccessNotify("Kayıt başarılı, yönlendiriliyor...");
        navigate("/stock")
      } else {
         dispatch(fetchFail());
         toastErrorNotify("Kayıt başarılı ancak kullanıcı verisi eksik.");
         console.error("Backend yanıtında kullanıcı adı eksik:", data);
      }
      
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Kayıt başarısız oldu");
      console.log(error);
    }
  }
  
  const logout = async () => {
    dispatch(fetchStart())
    try {
      await axiosToken.get("/auth/logout")
      dispatch(logoutSuccess())
      toastSuccessNotify("Çıkış başarılı");
      navigate("/"); // Çıkıştan sonra ana sayfaya yönlendir
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Çıkış başarısız oldu");
      console.log(error);
    }
  }

  return { login, register, logout }
}

export default useApiRequest