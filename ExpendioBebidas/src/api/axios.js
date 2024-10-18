import axios from "axios";

const instance = axios.create({
    // baseURL: 'https://www.apibebidas.misiones.gov.ar/api', 
    baseURL: 'http://localhost:3003/api',
    withCredentials:true
})

export default instance
