import { useCallback, useState } from "react";

export interface UseGeolocationReturn {
  loading: boolean;
  error: string | null;
  getPosition: () => Promise<GeolocationPosition | null>;
}

/**
 * Browser Geolocation API hook.
 * Returns a function that requests the user's current position.
 */
export function useGeolocation(): UseGeolocationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosition = useCallback(async (): Promise<GeolocationPosition | null> => {
    if (!navigator.geolocation) {
      setError("geolocationNotSupported");
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise<GeolocationPosition | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve(position);
        },
        (err) => {
          setLoading(false);
          setError(err.message || "geolocationError");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  }, []);

  return { loading, error, getPosition };
}
