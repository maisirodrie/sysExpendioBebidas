import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_ARCHIVO || 'http://localhost:3000/api';

if (typeof window !== "undefined" && window.location.protocol === "https:" && baseURL.startsWith("http://") && !baseURL.includes("localhost")) {
    baseURL = baseURL.replace("http://", "https://");
}

const instance = axios.create({
    baseURL,
    withCredentials: true
});

export default instance;

