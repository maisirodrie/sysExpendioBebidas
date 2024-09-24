import axios from "axios";

const instance = axios.create({
    // baseURL: 'https://www.apiarchivo.misiones.gov.ar/api', 
    baseURL: 'http://localhost:3006/api',
    withCredentials:true
})

export default instance
