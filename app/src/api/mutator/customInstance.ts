import type { AxiosRequestConfig } from 'axios';
import apiClient from '../axiosInstance';

export const customInstance = <T,>(config: AxiosRequestConfig): Promise<T> => {
  return apiClient(config).then((response) => response.data);
};

export default customInstance;
