import axios from 'axios';

export const AxiosApi = axios.create({
    // baseURL: 'https://pets-and-plus.vercel.app/api',
    baseURL: 'http://localhost:4321/api'
});