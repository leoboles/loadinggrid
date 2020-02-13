import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tamjarfe.azurewebsites.net/',
});

export default api;