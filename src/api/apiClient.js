// src/api/apiClient.js
import axiosInstance from "./axios";

const apiClient = {
  get: (url, config = {}) =>
    axiosInstance.get(url, config).then((res) => res.data),
  post: (url, data, config = {}) =>
    axiosInstance.post(url, data, config).then((res) => res.data),
  put: (url, data, config = {}) =>
    axiosInstance.put(url, data, config).then((res) => res.data),
  delete: (url, config = {}) =>
    axiosInstance.delete(url, config).then((res) => res.data),
};

export default apiClient;
