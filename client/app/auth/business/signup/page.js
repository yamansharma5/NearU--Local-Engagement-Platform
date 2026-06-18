"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

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
  categoryId: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export default function BusinessSignupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { lat: 12.9716, lng: 77.5946 },
  });

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
      router.push("/");
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to register business.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-semibold text-white">Register business</h1>
        <p className="mt-2 text-sm text-zinc-400">Create the owner account and business profile in one step.</p>

        <div className="mt-5 flex flex-col gap-2 rounded-md border border-zinc-800 bg-zinc-950 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-300">{locationStatus || "Location fields can be filled automatically."}</p>
          <button
            type="button"
            onClick={fillCurrentLocation}
            disabled={isLocating}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 px-3 text-sm font-medium text-zinc-100 hover:bg-zinc-900 disabled:opacity-60"
          >
            <MapPin className="h-4 w-4 text-emerald-300" />
            {isLocating ? "Fetching..." : "Use current location"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Owner name" error={errors.name?.message} inputProps={register("name")} />
          <Field label="Email" error={errors.email?.message} inputProps={register("email")} />
          <Field label="Owner phone" error={errors.phone?.message} inputProps={register("phone")} />
          <Field label="Password" type="password" error={errors.password?.message} inputProps={register("password")} />
          <Field label="Business name" error={errors.businessName?.message} inputProps={register("businessName")} />
          <Field label="Business phone" error={errors.businessPhone?.message} inputProps={register("businessPhone")} />
          <Field label="Category ID" error={errors.categoryId?.message} inputProps={register("categoryId")} />
          <Field label="Address" error={errors.address?.message} inputProps={register("address")} />
          <Field label="Latitude" type="number" step="any" error={errors.lat?.message} inputProps={register("lat")} />
          <Field label="Longitude" type="number" step="any" error={errors.lng?.message} inputProps={register("lng")} />
        </div>

        <label className="mt-4 block text-sm font-medium text-zinc-200">Description</label>
        <textarea className="mt-2 min-h-24 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-emerald-400" {...register("description")} />

        {serverError && <p className="mt-4 text-sm text-red-300">{serverError}</p>}

        <button disabled={isSubmitting} className="mt-6 h-11 w-full rounded-md bg-emerald-400 font-medium text-zinc-950 hover:bg-emerald-300 disabled:opacity-60">
          {isSubmitting ? "Registering..." : "Register business"}
        </button>

        <p className="mt-5 text-sm text-zinc-400">
          Already registered? <Link className="text-zinc-100 hover:text-white" href="/auth/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}

function Field({ label, type = "text", step, error, inputProps }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-200">{label}</label>
      <input type={type} step={step} className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-emerald-400" {...inputProps} />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
}
