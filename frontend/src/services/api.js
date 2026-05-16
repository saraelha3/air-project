import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

export const fetchWeather = () => api.get("/weather").then((r) => r.data);
export const fetchPrediction = () => api.get("/predict").then((r) => r.data);
export const fetchForecast = () => api.get("/forecast").then((r) => r.data);

export const fetchCustomPrediction = (params) =>
  api.post("/predict-custom", params).then((r) => r.data);

export default api;
