import { useState, useEffect, useCallback } from "react";

/**
 * useApi - A reusable hook for Axios API calls.
 * @param {Function} apiFunction - The API service function (must return a Promise).
 * @param {Array} dependencies - React dependency array to control re-runs.
 * @param {Object} options - Optional: { auto: true | false } — whether to fetch automatically.
 */
export const useApi = (
  apiFunction,
  dependencies = [],
  options = { auto: true }
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(options.auto);
  const [error, setError] = useState(null);

  // ✅ Wrapped fetch function to allow manual re-fetch
  const fetchData = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunction(...args);

        // Axios usually returns { data } object
        setData(response.data || response);
      } catch (err) {
        console.error("API Error:", err);

        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  // ✅ Auto-fetch on mount or dependency change
  useEffect(() => {
    if (options.auto) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};
