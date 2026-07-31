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
import { roleHome } from "@/lib/roleHome";
import AuthBrandMark from "@/components/common/AuthBrandMark";
import FieldError from "@/components/common/FieldError";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      router.push(roleHome(user.role));
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to log in.");
    }
  };

  return (
    <main className="dark min-h-screen bg-background px-6 py-8 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="hidden flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 lg:flex"
        >
          <div>
            <AuthBrandMark />
            <p className="max-w-md text-3xl font-semibold tracking-tight text-balance text-white">
              Log in to follow what is happening nearby.
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-white/70">
              Check the feed, switch to the map, and respond to local updates or enquiries without distraction.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              One account for people, business owners, and role-based access.
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              <span className="rounded-full border border-white/10 px-3 py-1">Nearby feed</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Map view</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Business inbox</span>
            </div>
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
          <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-white">Log in</CardTitle>
              <CardDescription className="text-white/70">
                Access your nearby feed, map, or business dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" aria-invalid={!!errors.email} {...register("email")} />
                  <FieldError>{errors.email?.message}</FieldError>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <FieldError>{errors.password?.message}</FieldError>
                </div>

                <FieldError>{serverError}</FieldError>

                <Button type="submit" disabled={isSubmitting} className="h-11 w-full text-sm">
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
                  <Link className="hover:text-foreground" href="/auth/signup">
                    Create a user account
                  </Link>
                  <Link className="hover:text-foreground" href="/auth/business/signup">
                    Register a business
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
