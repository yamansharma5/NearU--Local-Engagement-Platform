"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCategories } from "@/hooks/useCategories";
import AuthBrandMark from "@/components/common/AuthBrandMark";
import FieldError from "@/components/common/FieldError";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUploadField from "@/components/common/ImageUploadField";

const schema = z.object({
  name: z.string().min(2, "Owner name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Add one uppercase letter")
    .regex(/[0-9]/, "Add one number"),
  businessName: z.string().min(2, "Business name is required"),
  description: z.string().optional(),
  businessPhone: z.string().optional(),
  logo: z.string().url("Upload a valid logo image").or(z.literal("")).optional(),
  categoryId: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export default function BusinessSignupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { categories } = useCategories();
  const [serverError, setServerError] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { lat: 12.9716, lng: 77.5946, logo: "" },
  });
  const logoValue = useWatch({ control, name: "logo" });

  const fillCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Location is not supported by this browser.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Fetching current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));

        setValue("lat", lat, { shouldDirty: true, shouldValidate: true });
        setValue("lng", lng, { shouldDirty: true, shouldValidate: true });
        setLocationStatus("Current location added.");
        setIsLocating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied."
            : "Unable to fetch current location.";

        setLocationStatus(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [setValue]);

  useEffect(() => {
    const timer = window.setTimeout(fillCurrentLocation, 0);
    return () => window.clearTimeout(timer);
  }, [fillCurrentLocation]);

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const response = await api.post("/auth/business/register", values);
      const { token, user } = response.data.data;
      login({ token, user });
      router.push("/business");
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to register business.");
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="hidden flex-col justify-between rounded-[2rem] border border-border bg-neutral-50/70 p-8 lg:flex"
        >
          <div>
            <AuthBrandMark />
            <p className="max-w-md text-3xl font-semibold tracking-tight text-balance text-foreground">
              Put your business on the map with one clean profile.
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
              Reach nearby people with simple posts, a clear category, and a direct path to enquiries.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-border bg-white p-4 text-sm text-muted-foreground">
              Built for fast setup: owner details, business profile, and location in one flow.
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-white px-3 py-1">Profile</span>
              <span className="rounded-full border border-border bg-white px-3 py-1">Location</span>
              <span className="rounded-full border border-border bg-white px-3 py-1">Posts</span>
            </div>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full justify-self-center lg:justify-self-end"
        >
          <div className="lg:hidden">
            <AuthBrandMark />
          </div>
          <Card className="border-border bg-white shadow-lg shadow-black/3">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-foreground">Register business</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create the owner account and business profile in one step.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    {locationStatus || "Location fields can be filled automatically."}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fillCurrentLocation}
                    disabled={isLocating}
                    className="h-10 shrink-0 gap-2 px-3 text-sm"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    {isLocating ? "Fetching..." : "Use current location"}
                  </Button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Owner name" error={errors.name?.message} inputProps={register("name")} />
                  <Field label="Email" error={errors.email?.message} inputProps={register("email")} />
                  <Field label="Owner phone" error={errors.phone?.message} inputProps={register("phone")} />
                  <Field
                    label="Password"
                    type="password"
                    error={errors.password?.message}
                    inputProps={register("password")}
                  />
                  <Field
                    label="Business name"
                    error={errors.businessName?.message}
                    inputProps={register("businessName")}
                  />
                  <Field
                    label="Business phone"
                    error={errors.businessPhone?.message}
                    inputProps={register("businessPhone")}
                  />
                  <ImageUploadField
                    label="Business logo"
                    value={logoValue}
                    error={errors.logo?.message}
                    previewAlt="Business logo preview"
                    uploadPath="/upload/public"
                    onChange={(url) => setValue("logo", url, { shouldDirty: true, shouldValidate: true })}
                  />
                  <div>
                    <Label>Category</Label>
                    <select
                      className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
                      {...register("categoryId")}
                    >
                      <option value="">Choose category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <FieldError>{errors.categoryId?.message}</FieldError>
                  </div>
                  <Field label="Address" error={errors.address?.message} inputProps={register("address")} />
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

                <div className="mt-4 space-y-2">
                  <Label>Description</Label>
                  <Textarea {...register("description")} />
                </div>

                <FieldError>{serverError}</FieldError>

                <Button type="submit" disabled={isSubmitting} className="mt-6 h-11 w-full text-sm">
                  {isSubmitting ? "Registering..." : "Register business"}
                </Button>

                <p className="mt-5 text-sm text-muted-foreground">
                  Already registered?{" "}
                  <Link className="font-medium text-foreground hover:text-primary" href="/auth/login">
                    Log in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

function Field({ label, type = "text", step, error, inputProps }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} step={step} aria-invalid={!!error} {...inputProps} />
      <FieldError>{error}</FieldError>
    </div>
  );
}
