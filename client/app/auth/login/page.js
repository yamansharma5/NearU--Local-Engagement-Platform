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
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
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
      const response = await api.post("/auth/login", values);
      const { token, user } = response.data.data;
      login({ token, user });
      router.push("/");
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to log in.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-semibold text-white">Log in</h1>
        <p className="mt-2 text-sm text-zinc-400">Use your user or business account.</p>

        <label className="mt-6 block text-sm font-medium text-zinc-200">Email</label>
        <input className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-emerald-400" {...register("email")} />
        {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>}

        <label className="mt-4 block text-sm font-medium text-zinc-200">Password</label>
        <input type="password" className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-emerald-400" {...register("password")} />
        {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>}

        {serverError && <p className="mt-4 text-sm text-red-300">{serverError}</p>}

        <button disabled={isSubmitting} className="mt-6 h-11 w-full rounded-md bg-emerald-400 font-medium text-zinc-950 hover:bg-emerald-300 disabled:opacity-60">
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <div className="mt-5 flex justify-between text-sm text-zinc-400">
          <Link className="hover:text-white" href="/auth/signup">User signup</Link>
          <Link className="hover:text-white" href="/auth/business/signup">Business signup</Link>
        </div>
      </form>
    </main>
  );
}
