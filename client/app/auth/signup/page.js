"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import AuthBrandMark from "@/components/common/AuthBrandMark";
import FieldError from "@/components/common/FieldError";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      router.push("/feed");
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to create account.");
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="hidden flex-col justify-between rounded-[2rem] border border-border bg-neutral-50/70 p-8 lg:flex"
        >
          <div>
            <AuthBrandMark />
            <p className="max-w-md text-3xl font-semibold tracking-tight text-balance text-foreground">
              Create one account to discover what is nearby.
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
              Browse local offers and events, save interesting places, and contact businesses directly when something matters.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border bg-white px-3 py-1">Nearby feed</span>
            <span className="rounded-full border border-border bg-white px-3 py-1">Map view</span>
            <span className="rounded-full border border-border bg-white px-3 py-1">Saved items</span>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md justify-self-center lg:justify-self-end"
        >
          <div className="lg:hidden">
            <AuthBrandMark />
          </div>
          <Card className="border-border bg-white shadow-lg shadow-black/3">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-foreground">Create user account</CardTitle>
              <CardDescription className="text-muted-foreground">Start discovering nearby local updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field label="Name" error={errors.name?.message} inputProps={register("name")} />
                <Field label="Email" error={errors.email?.message} inputProps={register("email")} />
                <Field label="Phone" error={errors.phone?.message} inputProps={register("phone")} />
                <Field
                  label="Password"
                  type="password"
                  error={errors.password?.message}
                  inputProps={register("password")}
                />

                <FieldError>{serverError}</FieldError>

                <Button type="submit" disabled={isSubmitting} className="h-11 w-full text-sm">
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>

                <p className="text-sm text-muted-foreground">
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

function Field({ label, type = "text", error, inputProps }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} aria-invalid={!!error} {...inputProps} />
      <FieldError>{error}</FieldError>
    </div>
  );
}
