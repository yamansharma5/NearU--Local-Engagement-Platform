"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/categories")
      .then((response) => {
        if (!cancelled) setCategories(response.data.data.categories);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
