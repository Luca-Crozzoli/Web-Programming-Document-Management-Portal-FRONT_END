import axios from "axios"
const axiosInstance = axios.create({
    baseURL: `${process.env.VUE_APP_APIROOT}`,
    headers: {
      Accepted: 'appication/json',
      'Content-Type': 'application/json',
    },
  });
  
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('JWTToken');
      if (token) {
        config.headers.authorization =  `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  
  export default axiosInstance;