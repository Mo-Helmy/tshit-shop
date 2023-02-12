import axios from 'axios';
import { apiUrl, clientUrl } from './link-config';
console.log('🚀 ~ file: axiosInstance.js:3 ~ clientUrl', clientUrl);
console.log('🚀 ~ file: axiosInstance.js:3 ~ apiUrl', apiUrl);

const axiosInstance = axios.create({ baseURL: apiUrl });

axiosInstance.interceptors.request.use(async (config) => {
  // config.baseURL = apiUrl;

  try {
    const userDataRes = await axios.get(clientUrl + '/api/get-token');
    console.log(
      '🚀 ~ file: axiosInstance.js:12 ~ axiosInstance.interceptors.request.use ~ userDataRes',
      userDataRes.status,
      userDataRes.statusText,
      userDataRes.config.method,
      userDataRes.config.url
    );
    if (userDataRes.data.jwt)
      config.headers.Authorization = userDataRes.data.jwt;

    return config;
  } catch (err) {
    console.log(
      '🚀 ~ file: axiosInstance.js:18 ~ axiosInstance.interceptors.request.use ~ err',
      err
    );

    return config;
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      '🚀 ~ file: axiosInstance.js:16 ~ response',
      response.status,
      response.statusText,
      response.config.method,
      response.config.url
    );

    return response;
  },
  (error) => {
    console.error('🚀 ~ file: axiosInstance.js:22 ~ error', error);
    // console.error(
    //   '🚀 ~ file: axiosInstance.js:22 ~ error',
    //   error.response.config.url
    // );
    // console.error(
    //   '🚀 ~ file: axiosInstance.js:22 ~ error',
    //   error.response.config.method
    // );
    // console.error(
    //   '🚀 ~ file: axiosInstance.js:22 ~ error',
    //   error.response.config.status
    // );
    // console.error(
    //   '🚀 ~ file: axiosInstance.js:22 ~ error',
    //   error.response.config.statusText
    // );

    // return error;
    return Promise.reject(error.response);
  }
);

export const axiosApiAuth = axios.create({ baseURL: apiUrl });

axiosApiAuth.interceptors.request.use(async (config) => {
  try {
    const userDataRes = await axios.get(clientUrl + '/api/get-token');
    console.log(
      '🚀 ~ file: axiosInstance.js:12 ~ axiosInstance.interceptors.request.use ~ userDataRes',
      userDataRes.status,
      userDataRes.statusText,
      userDataRes.config.method,
      userDataRes.config.url
    );
    if (userDataRes.data.jwt)
      config.headers.Authorization = userDataRes.data.jwt;

    return config;
  } catch (err) {
    console.log(
      '🚀 ~ file: axiosInstance.js:18 ~ axiosInstance.interceptors.request.use ~ err',
      err
    );

    return config;
  }
});

export const axiosApi = axios.create({ baseURL: apiUrl });

export default axiosInstance;
