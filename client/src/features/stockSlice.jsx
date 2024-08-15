import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  purchases: [],
  sales: [],
  firms: [],
  products: [],
  brands: [],
  categories: [],
  loading: false,
  error: false,
}

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true
      state.error = false
    },

    getStockSuccess: (state, { payload: { path, stockData } }) => {
      state.loading = false
      state[path] = stockData
      state.error = false
    },

    getProPurBraFirmSuccess: (
      state,
      { payload: { products, purchases, firms, brands, categories } }
    ) => {
      state.loading = false
      state.products = products
      state.purchases = purchases
      state.brands = brands
      state.firms = firms
      if (categories) state.categories = categories
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
  getStockSuccess,
  getProPurBraFirmSuccess,
  fetchFail,
} = stockSlice.actions

export default stockSlice.reducer
