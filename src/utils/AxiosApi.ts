import axios from 'axios';

export const AxiosApi = axios.create({
    baseURL: 'http://localhost:4321/api'
});