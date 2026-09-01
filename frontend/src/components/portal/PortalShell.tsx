"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type {
  ReactNode,
} from "react";

import {
  Boxes,
  Building2,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Headphones,
  LayoutDashboard,
  PackageSearch,
  Settings,
  ShieldCheck,
  Truck,
  UsersRound,
  Warehouse,
  Waypoints,
} from "lucide-react";

export type NavItem = {
  href:
    string;

  label:
    string;

  icon:
    | "dashboard"
    | "shipments"
    | "hub"
    | "dispatch"
    | "staff"
    | "wms"
    | "support"
    | "admin"
    | "settings"
    | "verify"
    | "business";
};

const icons = {
  dashboard:
    LayoutDashboard,

  shipments:
    PackageSearch,

  hub:
    Building2,

  dispatch:
    Waypoints,

  staff:
    UsersRound,

  wms:
    Warehouse,

  support:
    Headphones,

  admin:
    ShieldCheck,

  settings:
    Settings,

  verify:
    ClipboardCheck,

  business:
    Truck,
};

export function PortalShell({
  title,
  subtitle,
  badge,
  nav,
  children,
}: {
  title:
    string;

  subtitle:
    string;

  badge?:
    string;

  nav:
    NavItem[];

  children:
    ReactNode;
}) {
  const pathname =
    usePathname();

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[275px_1fr]">

        <aside className="hidden border-r border-slate-200 bg-white p-5 lg:block">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0284c7] text-white shadow-[0_10px_30px_rgba(2,132,199,.18)]">
              <Boxes size={21} />
            </div>

            <div>

              <div className="font-black">
                Gogate Products
              </div>

              <div className="text-xs font-semibold text-slate-400">
                Logistics Platform
              </div>

            </div>

          </Link>

          <div className="mt-8 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4">

            <div className="text-[10px] font-black uppercase tracking-[.17em] text-[#0284c7]">
              Workspace
            </div>

            <div className="mt-1 font-black">
              {title}
            </div>

            {badge && (
              <span className="mt-3 inline-flex rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                {badge}
              </span>
            )}

          </div>

          <nav className="mt-7 space-y-1.5">

            {nav.map(
              (
                item,
              ) => {
                const Icon =
                  icons[
                    item.icon
                  ];

                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    href={
                      item.href
                    }
                    key={
                      item.href
                    }
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-[#0284c7] text-white shadow-[0_10px_25px_rgba(2,132,199,.18)]"
                        : "text-slate-600 hover:bg-sky-50 hover:text-[#0369a1]"
                    }`}
                  >

                    <span className="flex items-center gap-3">

                      <Icon size={18} />

                      {
                        item.label
                      }

                    </span>

                    <ChevronRight
                      size={15}
                      className={
                        active
                          ? "opacity-70"
                          : "opacity-30"
                      }
                    />

                  </Link>
                );
              },
            )}

          </nav>

        </aside>

        <main className="min-w-0">

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-8">

            <div className="flex items-center justify-between gap-5">

              <div>

                <div className="flex items-center gap-3 lg:hidden">

                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0284c7] text-white">
                    <Boxes size={18} />
                  </div>

                  <div className="font-black">
                    Gogate Products
                  </div>

                </div>

                <h1 className="mt-3 text-xl font-black tracking-tight lg:mt-0 sm:text-2xl">
                  {title}
                </h1>

                <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                  {subtitle}
                </p>

              </div>

              <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black shadow-sm">

                <CircleUserRound
                  size={19}
                  className="text-[#0284c7]"
                />

                Account

              </button>

            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">

              {nav.map(
                (
                  item,
                ) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600"
                  >
                    {
                      item.label
                    }
                  </Link>
                ),
              )}

            </div>

          </header>

          <div className="p-4 sm:p-8">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  color = "blue",
}: {
  label:
    string;

  value:
    string;

  hint:
    string;

  color?:
    "blue" |
    "green" |
    "orange" |
    "teal";
}) {
  const styles = {
    blue:
      "bg-sky-50 text-[#0284c7]",

    green:
      "bg-emerald-50 text-emerald-600",

    orange:
      "bg-orange-50 text-orange-600",

    teal:
      "bg-teal-50 text-teal-600",
  };

  return (
    <div className="gogate-card p-5">

      <span
        className={`rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wider ${styles[color]}`}
      >
        {label}
      </span>

      <div className="mt-5 text-3xl font-black">
        {value}
      </div>

      <div className="mt-2 text-sm text-slate-500">
        {hint}
      </div>

    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title:
    string;

  subtitle?:
    string;

  children:
    ReactNode;
}) {
  return (
    <section className="gogate-card p-5 sm:p-6">

      <h2 className="text-lg font-black">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      )}

      <div className="mt-5">
        {children}
      </div>

    </section>
  );
}

export function ApiState({
  loading,
  error,
}: {
  loading:
    boolean;

  error:
    string | null;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm font-bold text-[#0369a1]">
        Loading backend data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-700">
        {error}
      </div>
    );
  }

  return null;
}