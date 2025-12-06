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
      // Kullanıcı verisini güvenli bir şekilde al: payload.user veya payload.data'dan (veya doğrudan payload'dan)
      // Login için payload.user kullanıldığı varsayılmıştır.
      const userData = payload?.user || payload?.data || payload
      
      // Kullanıcı adını userData içinden güvenli bir şekilde al
      state.user = userData?.username || "" 
      state.token = payload?.token || ""
      state.error = false
    },

    registerSuccess: (state, { payload }) => {
      state.loading = false
      // Kullanıcı verisini güvenli bir şekilde al: payload.data, payload.user'dan (veya doğrudan payload'dan)
      // Register için payload.data kullanıldığı varsayılmıştır.
      const userData = payload?.data || payload?.user || payload
      
      // Kullanıcı adını userData içinden güvenli bir şekilde al
      state.user = userData?.username || "" 
      state.token = payload?.token || ""
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