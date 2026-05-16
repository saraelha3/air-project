import { useState, useEffect, useCallback } from "react";
import { fetchPrediction, fetchCustomPrediction } from "../services/api";

export default function useRiskPrediction() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPrediction();
      if (res.success) setPrediction(res.data);
    } catch (err) {
      setError(err.message || "Erreur de prédiction");
    } finally {
      setLoading(false);
    }
  }, []);

  const predictCustom = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchCustomPrediction(params);
      if (res.success) setPrediction(res.data);
      return res;
    } catch (err) {
      setError(err.message || "Erreur de prédiction");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { prediction, loading, error, refresh: load, predictCustom };
}
