// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
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
      state.error = false
    },

    loginSuccess: (state, { payload }) => {
      state.loading = false
      state.user = payload?.user || null
      // 🔑 backend response: bearer.accessToken
      state.token = payload?.bearer?.accessToken || ""
      state.error = false
    },

    registerSuccess: (state, { payload }) => {
      state.loading = false
      state.user = payload?.user || null
      state.token = payload?.bearer?.accessToken || ""
      state.error = false
    },

    logoutSuccess: (state) => {
      state.loading = false
      state.user = null
      state.token = ""
      state.error = false
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
