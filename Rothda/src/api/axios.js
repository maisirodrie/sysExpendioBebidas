import axios from "axios";

const instance = axios.create({
    baseURL: 'https://www.api.misiones.gov.ar/api',
    withCredentials:true
})

export default instance
