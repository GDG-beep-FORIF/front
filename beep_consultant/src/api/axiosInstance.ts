import axios, { AxiosInstance } from 'axios';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL as string;
const API_BASE_URL2: string = process.env.REACT_APP_API_BASE_URL2 as string;  

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': '*/*',
    },
});

const axiosInstance2: AxiosInstance = axios.create({
  baseURL: API_BASE_URL2,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosInstance, axiosInstance2 };