import axios from 'axios';

import { baseURL } from '../constants';
import { getSession } from 'next-auth/react';

const baseAxiosMethod = axios.create({
  baseURL,
});

baseAxiosMethod.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session && config.headers) {
      config.headers.Authorization = `Bearer ${session.user?.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default baseAxiosMethod;
