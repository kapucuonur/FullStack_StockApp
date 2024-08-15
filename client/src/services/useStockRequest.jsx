import { useDispatch } from "react-redux"
import useAxios from "./useAxios"
import {
  fetchFail,
  fetchStart,
  getStockSuccess,
  getProPurBraFirmSuccess,
} from "../features/stockSlice"
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify"

const useStockRequest = () => {
  const { axiosToken } = useAxios()
  const dispatch = useDispatch()

  // Generic GET
  const getStock = async (path = "firms") => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosToken.get(`/${path}`)
      // ✅ hem { data: [...] } hem doğrudan array için güvenli
      const stockData = data?.data || data
      dispatch(getStockSuccess({ stockData, path }))
    } catch (error) {
      toastErrorNotify(`${path} verileri çekilememiştir.`)
      dispatch(fetchFail())
      console.error(error)
    }
  }

  // DELETE
  const deleteStock = async (path = "firms", id) => {
    dispatch(fetchStart())
    try {
      await axiosToken.delete(`/${path}/${id}`)
      toastSuccessNotify(`${path} başarıyla silinmiştir.`)
      getStock(path)
    } catch (error) {
      toastErrorNotify(`${path} silinememiştir.`)
      dispatch(fetchFail())
      console.error(error)
    }
  }

  // POST
  const postStock = async (path = "firms", info) => {
    dispatch(fetchStart())
    try {
      await axiosToken.post(`/${path}`, info)
      getStock(path)
      toastSuccessNotify(`${path} başarıyla eklenmiştir.`)
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify(`${path} eklenememiştir.`)
      console.error(error)
    }
  }

  // PUT
  const putStock = async (path = "firms", info) => {
    dispatch(fetchStart())
    try {
      await axiosToken.put(`/${path}/${info._id}`, info)
      getStock(path)
      toastSuccessNotify(`${path} başarıyla güncellenmiştir.`)
    } catch (error) {
      toastErrorNotify(`${path} güncellenememiştir.`)
      dispatch(fetchFail())
      console.error(error)
    }
  }

  // Paralel çağrı
  const getProPurBraFirmStock = async () => {
    dispatch(fetchStart())
    try {
      const [pro, pur, bra, fir] = await Promise.all([
        axiosToken.get("/products"),
        axiosToken.get("/purchases"),
        axiosToken.get("/brands"),
        axiosToken.get("/firms"),
      ])

      const products = pro?.data?.data || pro?.data
      const purchases = pur?.data?.data || pur?.data
      const brands = bra?.data?.data || bra?.data
      const firms = fir?.data?.data || fir?.data

      dispatch(getProPurBraFirmSuccess({ products, purchases, brands, firms }))
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Stok verileri çekilememiştir.")
      console.error(error)
    }
  }

  return { getStock, deleteStock, postStock, putStock, getProPurBraFirmStock }
}

export default useStockRequest
