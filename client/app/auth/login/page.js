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
    <main className="dark flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <AuthBrandMark />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Log in</CardTitle>
            <CardDescription>Use your user or business account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label htmlFor="email">Email</Label>
              <Input id="email" aria-invalid={!!errors.email} {...register("email")} />
              <FieldError>{errors.email?.message}</FieldError>

              <div className="mt-4">
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

              <Button type="submit" disabled={isSubmitting} className="mt-6 h-11 w-full text-sm">
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>

              <div className="mt-5 flex justify-between text-sm text-muted-foreground">
                <Link className="hover:text-foreground" href="/auth/signup">
                  User signup
                </Link>
                <Link className="hover:text-foreground" href="/auth/business/signup">
                  Business signup
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
