import axios from "axios";

const instance = axios.create({
    // baseURL: 'https://www.api.misiones.gov.ar:3006/api', 
    baseURL: 'http://localhost:3006/api',
    withCredentials:true
})

export default instance
