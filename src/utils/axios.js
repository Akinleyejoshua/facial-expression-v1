import axios from "axios";

// const baseURL = "http://127.0.0.1:8000/api/v1/facial-expression";
// const baseURL = "https://dl-web-api-production.up.railway.app/api/v1/facial-expression";
// const baseURL = "https://dl-web-api-flask-production.up.railway.app/api/v1/facial-expression";

const settings = {
    baseURL: baseURL,
    headers: {
        Accept: "application/json,text/plain,*/*",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
    },
};

export const request = axios.create(settings);

request.interceptors.request.use(
    (config) => {
        const token = "0123456789";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
