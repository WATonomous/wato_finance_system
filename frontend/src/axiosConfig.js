import axios from 'axios'
import app from './firebase'
import { getAuth } from 'firebase/auth'
export const axiosPreset = axios.create({
    baseURL: `${process.env.REACT_APP_WATO_FINANCE_BACKEND_URL}`,
})

// dont have access to currentuser at axiosPreset creation, so append on at request time
axiosPreset.interceptors.request.use(
    async (config) => {
        const token = await getAuth(app).currentUser?.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
