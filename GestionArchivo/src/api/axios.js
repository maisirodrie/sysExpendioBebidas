import axios from "axios";

const instance = axios.create({
    // baseURL: 'https://www.api.misiones.gov.ar/api',
    baseURL: 'http://localhost:3007/api',
    withCredentials:true
})

export default instance
