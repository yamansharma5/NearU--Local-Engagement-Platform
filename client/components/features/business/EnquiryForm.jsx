"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/common/FieldError";

const schema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

export default function EnquiryForm({ businessId, postId }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await api.post("/enquiries", { businessId, postId, message: values.message });
      setSent(true);
      reset();
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to send enquiry.");
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mt-3 flex items-center gap-2 border-primary/25 bg-accent p-4 text-sm font-medium text-accent-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            Enquiry sent. The business will get back to you soon.
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mt-3 p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Textarea
                placeholder="Ask about this offer, hours, or anything else..."
                aria-invalid={!!errors.message}
                {...register("message")}
              />
              <FieldError>{errors.message?.message}</FieldError>
              <FieldError>{serverError}</FieldError>
              <Button type="submit" disabled={isSubmitting} className="mt-3 h-10 text-sm">
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send enquiry"}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
