import { useEffect, useState } from "react";
import type { z } from "zod";
import { readPlannerRows, writePlannerRows } from "@/lib/planner-storage";

export function usePlannerRows<T>(
  key: string,
  legacyKeys: readonly string[],
  defaults: T[],
  schema: z.ZodType<T[]>,
) {
  const [rows, setRows] = useState<T[]>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    try {
      const saved = readPlannerRows(window.localStorage, key, legacyKeys, schema);
      if (saved !== undefined) setRows(saved);
    } catch {
      setStorageWarning(true);
    }
    setLoaded(true);
  }, [key, legacyKeys, schema]);

  useEffect(() => {
    // Do not replace a saved plan with SSR defaults before it has been read.
    if (!loaded) return;
    try {
      setStorageWarning(!writePlannerRows(window.localStorage, key, rows));
    } catch {
      setStorageWarning(true);
    }
  }, [key, loaded, rows]);

  return { rows, setRows, storageWarning };
}
