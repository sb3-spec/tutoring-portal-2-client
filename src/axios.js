import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_URL : 'localhost:5000/',
    headers: {
        'Content-Type': 'application/json',        
        // 'withCredentials': 'true'      
    },
});