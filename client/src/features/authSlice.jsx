// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: "",
  token: "",
  loading: false,
  error: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true
      state.error = false // Yeni istek başlamadan hatayı sıfırla
    },

    loginSuccess: (state, { payload }) => {
      state.loading = false

      // Kullanıcı verisini güvenli şekilde al
      const userData = payload?.user || payload?.data || payload

      state.user = userData?.username || "" 
      // ✅ Doğru token: bearer.accessToken
      state.token = payload?.bearer?.accessToken || "" 
      state.error = false
    },

    registerSuccess: (state, { payload }) => {
      state.loading = false

      const userData = payload?.data || payload?.user || payload

      state.user = userData?.username || "" 
      // ✅ Doğru token: bearer.accessToken
      state.token = payload?.bearer?.accessToken || "" 
      state.error = false
    },

    logoutSuccess: (state) => {
      state.loading = false
      state.user = ""
      state.token = ""
      state.error = false // Başarılı çıkışta hatayı sıfırla
    },

    fetchFail: (state) => {
      state.loading = false
      state.error = true
    },
  },
})

export const {
  fetchStart,
  loginSuccess,
  fetchFail,
  registerSuccess,
  logoutSuccess,
} = authSlice.actions

export default authSlice.reducer
