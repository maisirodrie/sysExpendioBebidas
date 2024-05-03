import axios from "axios";

const instance = axios.create({
    // baseURL: 'https://138.117.77.148:3005/api',
    baseURL: 'http://localhost:3000/api',
    withCredentials:true
})

export default instance