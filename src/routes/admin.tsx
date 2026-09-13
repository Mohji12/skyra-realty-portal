import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Lock, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/skyra/SiteLayout";
import { PropertyForm, type PropertyDraft } from "@/components/skyra/PropertyForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProperties } from "@/hooks/useProperties";
import { usePageView } from "@/hooks/usePageView";
import { ADMIN_PASSWORD } from "@/lib/skyra/constants";
import {
  addProperty,
  deleteProperty,
  getPageViews,
  getVisits,
  resetToSeed,
  updateProperty,
} from "@/lib/skyra/storage";
import { formatDate, formatPrice } from "@/lib/skyra/format";
import type { Property } from "@/lib/skyra/types";

const ADMIN_SESSION_KEY = "skyra.adminUnlocked";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Skyra Realty" },
      {
        name: "description",
        content:
          "Manage Bengaluru property listings and view browser-local analytics for Skyra Realty.",
      },
    ],
  }),
  component: AdminPage,
});

type Tab = "manage" | "add" | "analytics";

function AdminPage() {
  usePageView("Admin page");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
  }, []);

  if (!unlocked) {
    return (
      <SiteLayout>
        <AdminGate onUnlock={() => setUnlocked(true)} />
      </SiteLayout>
    );
  }

  return <AdminDashboard />;
}

function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      onUnlock();
      return;
    }
    setError("Incorrect password. Try again.");
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-xl border border-border bg-card p-8 shadow-elegant">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-navy">
          <Lock className="h-5 w-5 text-gold" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-navy">Admin access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin password to manage listings and view analytics. This is a
          simple frontend gate — not real authentication.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter admin password"
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <Button type="submit" variant="gold" className="w-full">
            Unlock admin
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          Demo password: <span className="font-medium text-navy">{ADMIN_PASSWORD}</span>
        </p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { properties, ready, refresh } = useProperties();
  const [tab, setTab] = useState<Tab>("manage");
  const [editing, setEditing] = useState<Property | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3200);
  }

  function handleCreate(values: PropertyDraft) {
    const property: Property = {
      ...values,
      id: values.id || `skyra-${crypto.randomUUID()}`,
      viewCount: 0,
    };
    addProperty(property);
    setTab("manage");
    setEditing(null);
    flash(`Listed “${property.title}”.`);
  }

  function handleUpdate(values: PropertyDraft) {
    if (!editing) return;
    updateProperty(editing.id, { ...values, viewCount: editing.viewCount });
    setEditing(null);
    setTab("manage");
    flash(`Updated “${values.title}”.`);
  }

  function handleDelete(property: Property) {
    const ok = window.confirm(`Delete “${property.title}”? This cannot be undone.`);
    if (!ok) return;
    deleteProperty(property.id);
    if (editing?.id === property.id) {
      setEditing(null);
      setTab("manage");
    }
    flash(`Deleted “${property.title}”.`);
  }

  function handleReset() {
    const ok = window.confirm(
      "Reset all properties and analytics to the original seed data? Your local edits will be lost.",
    );
    if (!ok) return;
    resetToSeed();
    refresh();
    setEditing(null);
    setTab("manage");
    flash("Restored seed data and cleared analytics.");
  }

  const sorted = useMemo(
    () => [...properties].sort((a, b) => b.listedDate.localeCompare(a.listedDate)),
    [properties],
  );

  return (
    <SiteLayout>
      <section className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:py-10">
          <div>
            <p className="eyebrow text-gold">Admin</p>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
              Manage listings & analytics
            </h1>
            <p className="mt-2 max-w-xl text-sm text-navy-foreground/70">
              Add, edit or remove Bengaluru properties. Analytics are browser-local
              only — there is no server-side tracking.
            </p>
          </div>
          <Button variant="goldOutline" className="w-full sm:w-auto" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset to seed
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {notice && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-navy"
          >
            {notice}
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {(
            [
              { id: "manage" as const, label: "Manage listings" },
              {
                id: "add" as const,
                label: editing ? "Edit property" : "Add property",
              },
              { id: "analytics" as const, label: "Analytics" },
            ]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setEditing(null);
                setTab(item.id);
              }}
              className={
                tab === item.id
                  ? "rounded-full bg-navy px-4 py-2 text-sm font-medium text-gold"
                  : "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-gold hover:text-gold-deep"
              }
            >
              {item.id === "add" && !editing && (
                <Plus className="mr-1 inline h-3.5 w-3.5" />
              )}
              {item.label}
            </button>
          ))}
        </div>

        {tab === "manage" && (
          <div className="mt-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {ready ? `${sorted.length} properties in this browser` : "Loading…"}
              </p>
              <Button
                variant="gold"
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditing(null);
                  setTab("add");
                }}
              >
                <Plus className="h-4 w-4" />
                List property
              </Button>
            </div>

            {/* Mobile / tablet cards */}
            <div className="space-y-4 lg:hidden">
              {sorted.map((p) => (
                <article
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-elegant"
                >
                  <div className="flex gap-3">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-20 w-24 shrink-0 rounded-md border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-medium text-navy">{p.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.type} · {p.locality}
                      </p>
                      <p className="mt-2 font-display text-lg font-semibold text-gold-deep">
                        {formatPrice(p.price)}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" /> {p.viewCount ?? 0} views
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/property/$id" params={{ id: p.id }}>
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="goldOutline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setEditing(p);
                        setTab("add");
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => handleDelete(p)}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
              {ready && sorted.length === 0 && (
                <p className="rounded-xl border border-border px-4 py-10 text-center text-muted-foreground">
                  No properties yet. Add one to get started.
                </p>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-border lg:block">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-navy text-navy-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Locality</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Views</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="h-14 w-20 shrink-0 rounded-md border border-border object-cover"
                          />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-navy">{p.title}</div>
                            <div className="text-xs text-muted-foreground">
                              Listed {formatDate(p.listedDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.locality}</td>
                      <td className="px-4 py-3 font-medium text-gold-deep">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />
                          {p.viewCount ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to="/property/$id" params={{ id: p.id }}>
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="goldOutline"
                            size="sm"
                            onClick={() => {
                              setEditing(p);
                              setTab("add");
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(p)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {ready && sorted.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-muted-foreground"
                      >
                        No properties yet. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "add" && (
          <div className="mt-6 rounded-xl border border-border bg-card p-5 md:p-8">
            <h2 className="font-display text-2xl font-bold text-navy">
              {editing ? "Edit property" : "List a new property"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Saved to this browser’s localStorage and shown on the public listings
              page.
            </p>
            <div className="mt-6">
              <PropertyForm
                key={editing?.id ?? "new"}
                initial={editing ?? undefined}
                submitLabel={editing ? "Save changes" : "Publish listing"}
                onCancel={() => {
                  setEditing(null);
                  setTab("manage");
                }}
                onSubmit={editing ? handleUpdate : handleCreate}
              />
            </div>
          </div>
        )}

        {tab === "analytics" && <AnalyticsPanel properties={properties} />}
      </div>
    </SiteLayout>
  );
}

function AnalyticsPanel({ properties }: { properties: Property[] }) {
  const [visits, setVisits] = useState(0);
  const [pageViews, setPageViews] = useState(() => getPageViews());

  useEffect(() => {
    setVisits(getVisits());
    setPageViews(getPageViews());
  }, [properties]);

  const pageCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of pageViews) {
      map.set(entry.page, (map.get(entry.page) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);
  }, [pageViews]);

  const viewsOverTime = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const entry of pageViews) {
      const day = new Date(entry.timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    return [...byDay.entries()].map(([day, count]) => ({ day, count }));
  }, [pageViews]);

  const topProperties = useMemo(
    () =>
      [...properties]
        .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        .slice(0, 8)
        .map((p) => ({
          name: p.title.length > 28 ? `${p.title.slice(0, 28)}…` : p.title,
          views: p.viewCount ?? 0,
        })),
    [properties],
  );

  const ranked = useMemo(
    () =>
      [...properties].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)),
    [properties],
  );

  const totalPropertyViews = properties.reduce(
    (sum, p) => sum + (p.viewCount ?? 0),
    0,
  );

  return (
    <div className="mt-6 space-y-8">
      <p className="text-xs text-muted-foreground">
        Browser-local analytics only. Totals reflect activity on this device — not
        real multi-user traffic.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Platform visits", value: visits },
          { label: "Page view events", value: pageViews.length },
          { label: "Property detail views", value: totalPropertyViews },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card px-5 py-4"
          >
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-navy">
              {stat.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-xl font-semibold text-navy">
            Page-wise views
          </h3>
          <div className="mt-4 h-64">
            {pageCounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No page views logged yet. Browse the site, then return here.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageCounts} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e2d9" />
                  <XAxis
                    dataKey="page"
                    tick={{ fontSize: 11, fill: "#8A8C91" }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8A8C91" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D9A94E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-xl font-semibold text-navy">
            Views over time
          </h3>
          <div className="mt-4 h-64">
            {viewsOverTime.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Activity will appear here as you browse routes.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsOverTime} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e2d9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A8C91" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8A8C91" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#12253F"
                    strokeWidth={2}
                    dot={{ fill: "#D9A94E", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="font-display text-xl font-semibold text-navy">
            Most viewed properties
          </h3>
          <div className="mt-4 h-72">
            {topProperties.every((p) => p.views === 0) ? (
              <p className="text-sm text-muted-foreground">
                Open a few property detail pages to populate this chart.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProperties}
                  layout="vertical"
                  margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e2d9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fontSize: 10, fill: "#8A8C91" }}
                  />
                  <Tooltip />
                  <Bar dataKey="views" fill="#12253F" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-navy text-navy-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Locality</th>
              <th className="px-4 py-3 font-medium">Views</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((p, i) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <Link
                    to="/property/$id"
                    params={{ id: p.id }}
                    className="font-medium text-navy hover:text-gold-deep"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.locality}</td>
                <td className="px-4 py-3">{p.viewCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
