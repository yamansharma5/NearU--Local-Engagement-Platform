"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LocateFixed, Save } from "lucide-react";
import api from "@/lib/api";
import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/common/FieldError";
import ImageUploadField from "@/components/common/ImageUploadField";

const schema = z.object({
  name: z.string().min(2, "Business name is required"),
  description: z.string().max(2000).optional(),
  phone: z.string().optional(),
  logo: z.string().url("Upload a valid logo image").or(z.literal("")).optional(),
  categoryId: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export default function BusinessProfilePage() {
  const { categories } = useCategories();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      logo: "",
      categoryId: "",
      address: "",
      lat: 0,
      lng: 0,
    },
  });
  const logoValue = useWatch({ control, name: "logo" });

  useEffect(() => {
    let cancelled = false;
    api
      .get("/businesses/me")
      .then((response) => {
        if (cancelled) return;
        const business = response.data.data.business;
        reset({
          name: business.name || "",
          description: business.description || "",
          phone: business.phone || "",
          logo: business.logo || "",
          categoryId: business.categoryId || "",
          address: business.address || "",
          lat: business.lat,
          lng: business.lng,
        });
      })
      .catch(() => {
        if (!cancelled) setServerError("Unable to load profile.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reset]);

  const useCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Location is not available in this browser.");
      return;
    }

    setLocationStatus("Fetching current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("lat", Number(position.coords.latitude.toFixed(6)), {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("lng", Number(position.coords.longitude.toFixed(6)), {
          shouldDirty: true,
          shouldValidate: true,
        });
        setLocationStatus("Current location added.");
      },
      () => setLocationStatus("Location permission denied."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const onSubmit = async (values) => {
    setServerError("");
    setSaved(false);
    try {
      const payload = {
        ...values,
        logo: values.logo || null,
        categoryId: values.categoryId || null,
        description: values.description || null,
        phone: values.phone || null,
      };
      const response = await api.put("/businesses/me", payload);
      const business = response.data.data.business;
      reset({
        name: business.name || "",
        description: business.description || "",
        phone: business.phone || "",
        logo: business.logo || "",
        categoryId: business.categoryId || "",
        address: business.address || "",
        lat: business.lat,
        lng: business.lng,
      });
      setSaved(true);
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to save profile.");
    }
  };

  if (loading) {
    return <div className="h-80 animate-pulse rounded-lg bg-card" />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Profile setup</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Business profile</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This is what users see before they call, ask a question, or get directions.
        </p>
      </div>

      <Card className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Business name" error={errors.name?.message} inputProps={register("name")} />
            <Field label="Phone" error={errors.phone?.message} inputProps={register("phone")} />
            <ImageUploadField
              label="Business logo"
              value={logoValue}
              error={errors.logo?.message}
              previewAlt="Business logo preview"
              onChange={(url) => setValue("logo", url, { shouldDirty: true, shouldValidate: true })}
            />
            <div>
              <Label>Category</Label>
              <select
                className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
                {...register("categoryId")}
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Field label="Address" error={errors.address?.message} inputProps={register("address")} />
            </div>
            <Field
              label="Latitude"
              type="number"
              step="any"
              error={errors.lat?.message}
              inputProps={register("lat")}
            />
            <Field
              label="Longitude"
              type="number"
              step="any"
              error={errors.lng?.message}
              inputProps={register("lng")}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={useCurrentLocation}
            className="mt-4 h-10 gap-2 px-3 text-sm"
          >
            <LocateFixed className="h-4 w-4 text-primary" />
            Use current location
          </Button>
          {locationStatus && <p className="mt-2 text-xs text-muted-foreground">{locationStatus}</p>}

          <div className="mt-4">
            <Label>Description</Label>
            <Textarea aria-invalid={!!errors.description} {...register("description")} />
            <FieldError>{errors.description?.message}</FieldError>
          </div>

          <FieldError>{serverError}</FieldError>
          <AnimatePresence initial={false}>
            {saved && !isDirty && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 text-sm font-medium text-primary"
              >
                Profile saved.
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="mt-6 h-11 w-full gap-2 text-sm sm:w-auto"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, type = "text", step, error, inputProps }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} step={step} aria-invalid={!!error} {...inputProps} />
      <FieldError>{error}</FieldError>
    </div>
  );
}
