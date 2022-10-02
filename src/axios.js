import axios from "axios";


let NODE_ENV = "production";
let PROD_SERVER_URL = "https://tutoring-portal-backend.herokuapp.com/"

export const api = axios.create({
    baseURL: NODE_ENV === 'production' ?  PROD_SERVER_URL : 'http://localhost:5000/',
    headers: {
        'Content-Type': 'application/json',        
        // 'withCredentials': 'true'      
    },
});