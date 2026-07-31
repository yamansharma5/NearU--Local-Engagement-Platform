"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleUserRound, LogOut } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/locationStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/common/FieldError";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearLocation = useLocationStore((state) => state.clearLocation);
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || "", phone: user?.phone || "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name || "", phone: user.phone || "" });
  }, [user, reset]);

  const onSubmit = async (values) => {
    setServerError("");
    setSaved(false);
    try {
      const response = await api.put("/auth/me", values);
      const updatedUser = response.data.data.user;
      updateUser(updatedUser);
      reset({ name: updatedUser.name || "", phone: updatedUser.phone || "" });
      setSaved(true);
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    clearLocation();
    router.replace("/auth/login");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <CircleUserRound className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep your contact details current so nearby businesses can reach you easily.
            </p>
          </div>
        </div>
      </header>

      <Card className="mt-5 p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-2xl border border-dashed border-input bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
            <p className="mt-1 text-sm text-foreground/80">{user?.email}</p>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input aria-invalid={!!errors.name} {...register("name")} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input aria-invalid={!!errors.phone} {...register("phone")} />
            <FieldError>{errors.phone?.message}</FieldError>
          </div>

          <FieldError>{serverError}</FieldError>
          <AnimatePresence initial={false}>
            {saved && !isDirty && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm font-medium text-primary"
              >
                Profile updated.
              </motion.p>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={isSubmitting || !isDirty} className="h-11 w-full text-sm">
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>

      <Button type="button" variant="outline" onClick={handleLogout} className="mt-4 h-11 w-full text-sm">
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </main>
  );
}
