import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { restaurant as defaults } from "../config/restaurant.js";
import { api } from "../services/api.js";

const SettingsContext = createContext(defaults);

export function SettingsProvider({ children }) {
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api("/settings", { signal: controller.signal })
      .then(setRemote)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const value = useMemo(() => {
    if (!remote) return defaults;
    return {
      ...defaults,
      ...remote,
      address: { ...defaults.address, ...remote.address },
      hours: remote.hours?.length ? remote.hours : defaults.hours,
      social: defaults.social,
    };
  }, [remote]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useRestaurant = () => useContext(SettingsContext);