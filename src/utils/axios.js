import axios from 'axios';
import { backendUrl } from '../config';

// ----------------------------------------------------------------------
const https = require('https'); // disable ssl verification

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  baseURL: backendUrl
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
