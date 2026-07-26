"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit3, PlusCircle, Tags, Trash2, X } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/common/FieldError";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
});

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: "" } });

  const refreshCategories = () => {
    api
      .get("/categories")
      .then((response) => setCategories(response.data.data.categories))
      .catch(() => setServerError("Unable to load categories."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const onSubmit = async (values) => {
    setServerError("");
    setSavedMessage("");
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, values);
        setSavedMessage("Category updated.");
      } else {
        await api.post("/admin/categories", values);
        setSavedMessage("Category created.");
      }
      reset({ name: "" });
      setEditingCategory(null);
      refreshCategories();
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to save category.");
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setSavedMessage("");
    setServerError("");
    reset({ name: category.name });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    reset({ name: "" });
  };

  const removeCategory = async (category) => {
    setServerError("");
    setSavedMessage("");
    setDeletingId(category.id);
    try {
      await api.delete(`/admin/categories/${category.id}`);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      if (editingCategory?.id === category.id) cancelEditing();
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to delete category.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Moderation</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Categories</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Categories power filters across the feed, map, and business signup.
        </p>
      </div>

      <Card className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={editingCategory ? "edit" : "new"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="font-semibold tracking-tight"
            >
              {editingCategory ? "Edit category" : "New category"}
            </motion.h2>
          </AnimatePresence>
          {editingCategory && (
            <Button type="button" variant="outline" onClick={cancelEditing} className="h-9 gap-2 px-3 text-sm">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <Label>Name</Label>
            <Input aria-invalid={!!errors.name} {...register("name")} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>
          <Button type="submit" disabled={isSubmitting} className="h-11 gap-2 text-sm sm:mt-6">
            <PlusCircle className="h-4 w-4" />
            {isSubmitting ? "Saving..." : editingCategory ? "Update category" : "Create category"}
          </Button>
        </form>

        <FieldError>{serverError}</FieldError>
        <AnimatePresence initial={false}>
          {savedMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 text-sm font-medium text-primary"
            >
              {savedMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </Card>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-5 text-sm text-muted-foreground">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <Tags className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground/80">No categories yet.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-3 border-b border-border p-5 last:border-0"
            >
              <div>
                <p className="font-semibold tracking-tight">{category.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{category.slug}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => startEditing(category)}
                  className="h-9 gap-2 px-3 text-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeCategory(category)}
                  disabled={deletingId === category.id}
                  className="h-9 gap-2 px-3 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === category.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
