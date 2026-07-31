"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Edit3, PlusCircle, RotateCcw, Trash2, X } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/common/FieldError";
import ImageUploadField from "@/components/common/ImageUploadField";

const schema = z
  .object({
    type: z.enum(["UPDATE", "OFFER", "EVENT"]),
    title: z.string().min(2, "Title is required").max(150),
    content: z.string().min(10, "Content must be at least 10 characters").max(5000),
    image: z.string().url("Upload a valid post image").or(z.literal("")).optional(),
    discount: z.string().optional(),
    expiresInHours: z.enum(["1", "3", "6", "24", "48"]).optional(),
    eventDate: z.string().optional(),
    venue: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.type !== "EVENT" && !data.expiresInHours) {
      context.addIssue({ code: "custom", path: ["expiresInHours"], message: "Choose when this post should expire" });
    }

    if (data.type === "OFFER") {
      if (!data.discount) {
        context.addIssue({ code: "custom", path: ["discount"], message: "Discount is required for an offer" });
      }
    }
    if (data.type === "EVENT") {
      if (!data.eventDate) {
        context.addIssue({ code: "custom", path: ["eventDate"], message: "Event date is required" });
      }
      if (!data.venue) {
        context.addIssue({ code: "custom", path: ["venue"], message: "Venue is required for an event" });
      }
    }
  });

const DEFAULT_VALUES = {
  type: "UPDATE",
  title: "",
  content: "",
  image: "",
  discount: "",
  expiresInHours: "24",
  eventDate: "",
  venue: "",
};

const EXPIRY_OPTIONS = [
  { value: "1", label: "1 hr" },
  { value: "3", label: "3 hrs" },
  { value: "6", label: "6 hrs" },
  { value: "24", label: "24 hrs" },
  { value: "48", label: "2 days" },
];

export default function BusinessPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES });

  const type = useWatch({ control, name: "type" });
  const imageValue = useWatch({ control, name: "image" });

  const refreshPosts = () => {
    setLoading(true);
    api
      .get("/posts/me")
      .then((response) => setPosts(response.data.data.posts))
      .catch(() => setServerError("Unable to load posts."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;

    api
      .get("/posts/me")
      .then((response) => {
        if (!cancelled) setPosts(response.data.data.posts);
      })
      .catch(() => {
        if (!cancelled) setServerError("Unable to load posts.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: posts.filter((post) => isPostPubliclyActive(post)).length,
      offers: posts.filter((post) => post.type === "OFFER" && isPostPubliclyActive(post)).length,
      events: posts.filter((post) => post.type === "EVENT" && isPostPubliclyActive(post)).length,
      expired: posts.filter((post) => isExpiredPost(post)).length,
    }),
    [posts]
  );

  const onSubmit = async (values) => {
    setServerError("");
    setSavedMessage("");

    const payload = {
      type: values.type,
      title: values.title,
      content: values.content,
      image: values.image || null,
      discount: values.type === "OFFER" ? values.discount : null,
      expiresInHours: values.type !== "EVENT" ? Number(values.expiresInHours) : undefined,
      eventDate: values.type === "EVENT" ? values.eventDate : null,
      venue: values.type === "EVENT" ? values.venue : null,
    };

    try {
      if (editingPost) {
        await api.put(`/posts/${editingPost.id}`, payload);
        setSavedMessage("Post updated.");
      } else {
        await api.post("/posts", payload);
        setSavedMessage("Post created.");
      }
      reset(DEFAULT_VALUES);
      setEditingPost(null);
      refreshPosts();
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to save post.");
    }
  };

  const startEditing = (post, { extend = false } = {}) => {
    setEditingPost(post);
    setSavedMessage("");
    setServerError("");
    reset({
      type: post.type,
      title: post.title || "",
      content: post.content || "",
      image: post.image || "",
      discount: post.discount || "",
      expiresInHours: extend ? "24" : getClosestExpiryOption(post.validUntil),
      eventDate: post.eventDate ? toDatetimeLocal(post.eventDate) : "",
      venue: post.venue || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingPost(null);
    reset(DEFAULT_VALUES);
  };

  const removePost = async (post) => {
    setServerError("");
    setSavedMessage("");
    try {
      await api.delete(`/posts/${post.id}`);
      setSavedMessage("Post deleted.");
      setPosts((current) => current.filter((item) => item.id !== post.id));
      if (editingPost?.id === post.id) cancelEditing();
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to delete post.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Posts</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Create and manage posts</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Updates, offers, and events appear in nearby users&apos; feed and map using your business location.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center sm:min-w-80">
          <MiniStat label="Active" value={counts.all} />
          <MiniStat label="Offers" value={counts.offers} />
          <MiniStat label="Expired" value={counts.expired} />
        </div>
      </div>

      <Card className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={editingPost ? "edit" : "new"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="font-semibold tracking-tight"
            >
              {editingPost ? "Edit post" : "New post"}
            </motion.h2>
          </AnimatePresence>
          {editingPost && (
            <Button type="button" variant="outline" onClick={cancelEditing} className="h-9 gap-2 px-3 text-sm">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div>
              <Label>Type</Label>
              <select
                className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
                {...register("type")}
              >
                <option value="UPDATE">Update</option>
                <option value="OFFER">Offer</option>
                <option value="EVENT">Event</option>
              </select>
            </div>
            <Field label="Title" error={errors.title?.message} inputProps={register("title")} />
          </div>

          <div>
            <Label>Content</Label>
            <Textarea aria-invalid={!!errors.content} {...register("content")} />
            <FieldError>{errors.content?.message}</FieldError>
          </div>

          <ImageUploadField
            label="Post image"
            value={imageValue}
            error={errors.image?.message}
            previewAlt="Post preview"
            onChange={(url) => setValue("image", url, { shouldDirty: true, shouldValidate: true })}
          />

          <AnimatePresence initial={false}>
            {type !== "EVENT" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="grid gap-4 overflow-hidden md:grid-cols-2"
              >
                {type === "OFFER" && (
                  <Field label="Discount" error={errors.discount?.message} inputProps={register("discount")} />
                )}
                <ExpiryField
                  label={type === "OFFER" ? "Offer expires after" : "Post expires after"}
                  error={errors.expiresInHours?.message}
                  inputProps={register("expiresInHours")}
                />
              </motion.div>
            )}

            {type === "EVENT" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="grid gap-4 overflow-hidden md:grid-cols-2"
              >
                <Field
                  label="Event date"
                  type="datetime-local"
                  error={errors.eventDate?.message}
                  inputProps={register("eventDate")}
                />
                <Field label="Venue" error={errors.venue?.message} inputProps={register("venue")} />
              </motion.div>
            )}
          </AnimatePresence>

          <FieldError>{serverError}</FieldError>
          <AnimatePresence initial={false}>
            {savedMessage && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm font-medium text-primary"
              >
                {savedMessage}
              </motion.p>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full gap-2 text-sm sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            {isSubmitting ? "Saving..." : editingPost ? "Update post" : "Create post"}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold tracking-tight">Your posts</h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No posts yet. Create one above.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="border-b border-border p-5 last:border-0">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={isExpiredPost(post) ? "destructive" : "secondary"}>
                      {isExpiredPost(post) ? "Expired" : post.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(post.createdAt), "d MMM yyyy")}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold tracking-tight">{post.title}</h3>
                  {post.image && (
                    <div className="mt-3 overflow-hidden rounded-md border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                    </div>
                  )}
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{post.content}</p>
                  {post.type === "OFFER" && (
                    <p className="mt-2 text-sm font-semibold text-[#b0532a]">
                      {post.discount} {post.validUntil && `until ${format(new Date(post.validUntil), "d MMM, h:mm a")}`}
                    </p>
                  )}
                  {post.type !== "OFFER" && post.validUntil && (
                    <p className="mt-2 text-sm font-semibold text-muted-foreground">
                      Expires {format(new Date(post.validUntil), "d MMM, h:mm a")}
                    </p>
                  )}
                  {post.type === "EVENT" && (
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {post.eventDate && format(new Date(post.eventDate), "d MMM, h:mm a")}
                      {post.venue && ` at ${post.venue}`}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {isExpiredPost(post) && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => startEditing(post, { extend: true })}
                      className="h-9 gap-2 px-3 text-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Extend
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEditing(post)}
                    className="h-9 gap-2 px-3 text-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removePost(post)}
                    className="h-9 gap-2 px-3 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </Card>
    </div>
  );
}

function Field({ label, type = "text", error, inputProps }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} aria-invalid={!!error} {...inputProps} />
      <FieldError>{error}</FieldError>
    </div>
  );
}

function ExpiryField({ label, error, inputProps }) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
        aria-invalid={!!error}
        {...inputProps}
      >
        {EXPIRY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError>{error}</FieldError>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <Card className="p-3">
      <div className="text-xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
    </Card>
  );
}

function toDatetimeLocal(value) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function getClosestExpiryOption(validUntil) {
  if (!validUntil) return "24";

  const hoursRemaining = (new Date(validUntil).getTime() - Date.now()) / (60 * 60 * 1000);
  const nearest = EXPIRY_OPTIONS.reduce((closest, option) => {
    return Math.abs(Number(option.value) - hoursRemaining) < Math.abs(Number(closest.value) - hoursRemaining)
      ? option
      : closest;
  }, EXPIRY_OPTIONS[0]);

  return nearest.value;
}

function isExpiredPost(post) {
  return !!post.expiredAt || (post.validUntil && new Date(post.validUntil) <= new Date());
}

function isPostPubliclyActive(post) {
  return post.isActive && !isExpiredPost(post);
}
