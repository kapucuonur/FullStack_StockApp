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
                  // Normalize payload shapes: server may return { token, bearer:{accessToken}, user }
                  const userData = payload?.user || payload?.data || payload

                  // Prefer username -> email -> id -> any truthy user object as string
                  state.user =
                        userData?.username || userData?.email || userData?._id || (typeof userData === "string" ? userData : "")

                  // Capture token from multiple possible locations
                  state.token =
                        payload?.token || payload?.bearer?.accessToken || payload?.accessToken || ""

                  state.error = false
            },

            registerSuccess: (state, { payload }) => {
                  state.loading = false
                  const userData = payload?.data || payload?.user || payload
                  state.user =
                        userData?.username || userData?.email || userData?._id || (typeof userData === "string" ? userData : "")
                  state.token = payload?.token || payload?.bearer?.accessToken || payload?.accessToken || ""
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