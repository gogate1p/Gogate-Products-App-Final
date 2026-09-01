"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Boxes,
  Building2,
  ClipboardCheck,
  Gauge,
  PackageSearch,
  ScanLine,
  TriangleAlert,
  Truck,
  UsersRound,
  Warehouse,
  Waypoints,
} from "lucide-react";

const nav = [
  {
    href:
      "/portal/hub",
    label:
      "Overview",
    icon:
      Gauge,
  },

  {
    href:
      "/portal/hub/inbound",
    label:
      "Inbound",
    icon:
      PackageSearch,
  },

  {
    href:
      "/portal/hub/outbound",
    label:
      "Outbound",
    icon:
      Truck,
  },

  {
    href:
      "/portal/hub/scan",
    label:
      "Scan Station",
    icon:
      ScanLine,
  },

  {
    href:
      "/portal/hub/manifests",
    label:
      "Manifests",
    icon:
      Waypoints,
  },

  {
    href:
      "/portal/hub/bags",
    label:
      "Bags",
    icon:
      Boxes,
  },

  {
    href:
      "/portal/hub/kyc",
    label:
      "Rider Verification",
    icon:
      ClipboardCheck,
  },

  {
    href:
      "/portal/hub/vehicles",
    label:
      "Vehicles",
    icon:
      Truck,
  },

  {
    href:
      "/portal/hub/capacity",
    label:
      "Capacity",
    icon:
      Warehouse,
  },

  {
    href:
      "/portal/hub/exceptions",
    label:
      "Exceptions",
    icon:
      TriangleAlert,
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

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[280px_1fr]">

        <aside className="hidden border-r border-slate-200 bg-white p-5 lg:block">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0284c7] text-white shadow-[0_12px_30px_rgba(2,132,199,.2)]">
              <Building2 size={21} />
            </div>

            <div>
              <div className="font-black">
                Gogate Products
              </div>

              <div className="text-xs font-bold text-slate-400">
                Hub Operations
              </div>
            </div>

          </Link>

          <div className="mt-7 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4">

            <div className="text-[10px] font-black uppercase tracking-[.18em] text-[#0284c7]">
              Operations workspace
            </div>

            <div className="mt-2 font-black">
              Hub Control Center
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Inbound • Sort • Dispatch
            </div>

          </div>

          <nav className="mt-6 space-y-1.5">

            {nav.map(
              item => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                      active
                        ? "bg-[#0284c7] text-white shadow-[0_10px_25px_rgba(2,132,199,.18)]"
                        : "text-slate-600 hover:bg-sky-50 hover:text-[#0369a1]"
                    }`}
                  >

                    <Icon size={18} />

                    {
                      item.label
                    }

                  </Link>
                );
              },
            )}

          </nav>

        </aside>

        <main className="min-w-0">

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-7">

            <div className="flex items-center justify-between gap-5">

              <div>

                <div className="text-[10px] font-black uppercase tracking-[.18em] text-[#0284c7]">
                  Gogate Products
                </div>

                <div className="mt-1 text-lg font-black sm:text-xl">
                  Hub Operations
                </div>

              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
                ● Operations Live
              </div>

            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">

              {nav.map(
                item => (
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

          <div className="p-4 sm:p-7">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}