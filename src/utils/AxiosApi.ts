import axios from 'axios';

export const AxiosApi = axios.create({
    baseURL: process.env.DOMAIN_NAME + '/api',
});
