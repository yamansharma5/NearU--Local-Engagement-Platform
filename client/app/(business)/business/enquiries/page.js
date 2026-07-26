"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Inbox, Mail, Phone } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BusinessEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/enquiries/me")
      .then((response) => {
        if (!cancelled) setEnquiries(response.data.data.enquiries);
      })
      .catch(() => {
        if (!cancelled) setServerError("Unable to load enquiries.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const markReplied = async (id) => {
    setUpdatingId(id);
    setServerError("");
    try {
      const response = await api.put(`/enquiries/${id}/status`);
      setEnquiries((current) =>
        current.map((enquiry) => (enquiry.id === id ? response.data.data.enquiry : enquiry))
      );
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to update enquiry.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Inbox</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Enquiries</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Reply outside the app, then mark the enquiry as replied.
        </p>
      </div>

      {serverError && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-5 text-sm text-muted-foreground">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground/80">No enquiries yet.</p>
          </div>
        ) : (
          enquiries.map((enquiry) => (
            <article key={enquiry.id} className="border-b border-border p-5 last:border-0">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold tracking-tight">{enquiry.user?.name || "Nearby user"}</h2>
                    <Badge variant={enquiry.status === "REPLIED" ? "success" : "secondary"}>
                      {enquiry.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(enquiry.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {enquiry.post && (
                    <p className="mt-1 text-sm text-muted-foreground">About: {enquiry.post.title}</p>
                  )}
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/80">{enquiry.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {enquiry.user?.email && (
                      <a
                        href={`mailto:${enquiry.user.email}`}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {enquiry.user.email}
                      </a>
                    )}
                    {enquiry.user?.phone && (
                      <a
                        href={`tel:${enquiry.user.phone}`}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {enquiry.user.phone}
                      </a>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => markReplied(enquiry.id)}
                  disabled={enquiry.status === "REPLIED" || updatingId === enquiry.id}
                  className="h-10 shrink-0 gap-2 px-4 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {updatingId === enquiry.id ? "Updating..." : "Mark replied"}
                </Button>
              </div>
            </article>
          ))
        )}
      </Card>
    </div>
  );
}
