import axios from "axios";

const instance = axios.create({
    baseURL: 'http://138.117.77.148:3005/api',
    withCredentials:true
})

export default instance