"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

let cachedCategories = null;
let inFlightCategoriesRequest = null;

export function useCategories() {
  const [categories, setCategories] = useState(() => cachedCategories || []);
  const [loading, setLoading] = useState(() => !cachedCategories);

  useEffect(() => {
    let cancelled = false;

    if (cachedCategories) {
      return undefined;
    }

    if (!inFlightCategoriesRequest) {
      inFlightCategoriesRequest = api.get("/categories").then((response) => response.data.data.categories);
    }

    inFlightCategoriesRequest
      .then((result) => {
        cachedCategories = result;
        if (!cancelled) setCategories(result);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
        inFlightCategoriesRequest = null;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
