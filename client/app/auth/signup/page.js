"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Add one uppercase letter")
    .regex(/[0-9]/, "Add one number"),
});

export default function SignupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const response = await api.post("/auth/register", values);
      const { token, user } = response.data.data;
      login({ token, user });
      router.push("/");
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to create account.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-semibold text-white">Create user account</h1>
        <p className="mt-2 text-sm text-zinc-400">Start discovering nearby local updates.</p>

        <Field label="Name" error={errors.name?.message} inputProps={register("name")} />
        <Field label="Email" error={errors.email?.message} inputProps={register("email")} />
        <Field label="Phone" error={errors.phone?.message} inputProps={register("phone")} />
        <Field label="Password" type="password" error={errors.password?.message} inputProps={register("password")} />

        {serverError && <p className="mt-4 text-sm text-red-300">{serverError}</p>}

        <button disabled={isSubmitting} className="mt-6 h-11 w-full rounded-md bg-emerald-400 font-medium text-zinc-950 hover:bg-emerald-300 disabled:opacity-60">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-sm text-zinc-400">
          Already registered? <Link className="text-zinc-100 hover:text-white" href="/auth/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}

function Field({ label, type = "text", error, inputProps }) {
  return (
    <>
      <label className="mt-4 block text-sm font-medium text-zinc-200">{label}</label>
      <input type={type} className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-emerald-400" {...inputProps} />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </>
  );
}
