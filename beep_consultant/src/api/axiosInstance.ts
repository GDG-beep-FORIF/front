import axios, { AxiosInstance } from 'axios';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL as string; 

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

export default axiosInstance;