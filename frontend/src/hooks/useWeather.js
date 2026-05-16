import { useState, useEffect, useCallback } from "react";
import { fetchWeather, fetchForecast } from "../services/api";

export default function useWeather(refreshInterval = 300000) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [wRes, fRes] = await Promise.all([fetchWeather(), fetchForecast()]);
      if (wRes.success) setWeather(wRes.data);
      if (fRes.success) setForecast(fRes.data);
    } catch (err) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, refreshInterval);
    return () => clearInterval(id);
  }, [load, refreshInterval]);

  return { weather, forecast, loading, error, refresh: load };
}
