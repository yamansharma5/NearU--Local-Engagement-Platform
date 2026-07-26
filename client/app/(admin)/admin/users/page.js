"use client";

import { useEffect, useState } from "react";
import { Search, Users as UsersIcon } from "lucide-react";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/users", { params: { search: debouncedSearch || undefined } })
      .then((response) => {
        if (!cancelled) setUsers(response.data.data.users);
        if (!cancelled) setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load users.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const toggleStatus = async (user) => {
    setUpdatingId(user.id);
    setError("");
    try {
      const response = await api.put(`/admin/users/${user.id}/status`);
      const updated = response.data.data.user;
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Moderation</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Users</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Search accounts and suspend anyone violating guidelines.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email..."
          className="pl-10"
        />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-5 text-sm text-muted-foreground">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <UsersIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground/80">No users found.</p>
          </div>
        ) : (
          users.map((user) => (
            <article
              key={user.id}
              className="flex flex-col gap-3 border-b border-border p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold tracking-tight">{user.name}</h2>
                  <Badge variant="secondary">{user.role}</Badge>
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Active" : "Suspended"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                {user.business && (
                  <p className="mt-1 text-xs text-muted-foreground">Owns: {user.business.name}</p>
                )}
              </div>

              <Button
                type="button"
                variant={user.isActive ? "destructive" : "outline"}
                onClick={() => toggleStatus(user)}
                disabled={updatingId === user.id}
                className="h-9 shrink-0 gap-2 px-3 text-sm"
              >
                {updatingId === user.id ? "Updating..." : user.isActive ? "Suspend" : "Reinstate"}
              </Button>
            </article>
          ))
        )}
      </Card>
    </div>
  );
}
