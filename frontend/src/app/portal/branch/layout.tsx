"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Building2,
  Gauge,
  LogOut,
  PackagePlus,
  PackageSearch,
  Truck,
  UsersRound,
} from "lucide-react";

import {
  branchLogout,
} from "@/lib/branch-api";

const nav = [
  {
    href:
      "/portal/branch",
    label:
      "Dashboard",
    icon:
      Gauge,
  },

  {
    href:
      "/portal/branch/pickups",
    label:
      "Pickups",
    icon:
      Truck,
  },

  {
    href:
      "/portal/branch/shipments",
    label:
      "Shipments",
    icon:
      PackageSearch,
  },

  {
    href:
      "/portal/branch/book",
    label:
      "Book Shipment",
    icon:
      PackagePlus,
  },

  {
    href:
      "/portal/branch/users",
    label:
      "Branch Users",
    icon:
      UsersRound,
  },

  {
    href:
      "/portal/branch/branches",
    label:
      "Branches",
    icon:
      Building2,
  },
];

export default function Layout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const pathname =
    usePathname();

  if (
    pathname ===
    "/portal/branch/login"
  ) {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[270px_1fr]">

        <aside className="hidden border-r border-slate-200 bg-white p-5 lg:block">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0284c7] text-white">
              <Building2 size={21} />
            </div>

            <div>
              <div className="font-black">
                Gogate Products
              </div>

              <div className="text-xs font-bold text-slate-400">
                Courier Branch
              </div>
            </div>

          </div>

          <nav className="mt-8 space-y-1.5">

            {nav.map(
              item => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black ${
                      active
                        ? "bg-[#0284c7] text-white"
                        : "text-slate-600 hover:bg-sky-50"
                    }`}
                  >
                    <Icon size={18} />

                    {item.label}
                  </Link>
                );
              },
            )}

          </nav>

          <button
            onClick={branchLogout}
            className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>

        </aside>

        <main className="min-w-0">

          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-xl">

            <div className="text-[10px] font-black uppercase tracking-[.18em] text-[#0284c7]">
              Gogate Products
            </div>

            <div className="mt-1 text-lg font-black">
              Courier Branch Operations
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">

              {nav.map(
                item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black"
                  >
                    {item.label}
                  </Link>
                ),
              )}

            </div>

          </header>

          <div className="p-4 sm:p-7">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}