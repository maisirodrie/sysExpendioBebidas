import axios from "axios";

const instance = axios.create({
    baseURL: 'https://10.10.0.26:3006/api', 
    // baseURL: 'http://localhost:3000/api',
    withCredentials:true
})

export default instance
