"use client";

import {
  ArrowUpRight,
  Box,
  Clock3,
  PackageCheck,
  Search,
  Truck,
} from "lucide-react";
import { Header } from "@/components/header";

export default function AccountPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-bold text-[#2563eb]">Customer dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Good afternoon 👋
            </h1>
            <p className="mt-2 text-slate-500">
              Here is what is happening with your shipments.
            </p>
          </div>

          <a
            href="/track"
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#2563eb] px-5 py-3 font-bold text-slate-900"
          >
            <Search size={18} />
            Track shipment
          </a>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={<Box />} value="12" label="Total shipments" />
          <Metric icon={<Truck />} value="4" label="In transit" />
          <Metric icon={<Clock3 />} value="2" label="Arriving today" />
          <Metric icon={<PackageCheck />} value="6" label="Delivered" />
        </div>

        <div className="glass mt-8 overflow-hidden rounded-[2rem]">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-xl font-black">Recent shipments</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest activity across your account
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              ["GPX48296610", "In transit", "Pune → Mumbai"],
              ["GPX48296531", "Delivered", "Delhi → Gurugram"],
              ["GPX48296498", "At hub", "Bengaluru → Mysuru"],
            ].map(([awb, status, route]) => (
              <div
                key={awb}
                className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-black">{awb}</p>
                  <p className="mt-1 text-sm text-slate-500">{route}</p>
                </div>

                <div className="flex items-center gap-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#2563eb]">
                    {status}
                  </span>
                  <ArrowUpRight size={18} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-[#2563eb]">{icon}</div>
      <p className="mt-5 text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
