import axios from 'axios'
export const axiosPreset = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
})
