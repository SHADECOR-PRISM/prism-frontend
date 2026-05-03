import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let memorizedToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memorizedToken = token;
};

apiClient.interceptors.request.use(
  (request) => {
    if (memorizedToken) {
      request.headers.Authorization = `Bearer ${memorizedToken}`;
    }
    return request;
  },
  (error) => {
    console.error("Invalid request");
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Out of tokens or Invalid request");
    }
    return Promise.reject(error);
  }
);

export default apiClient;