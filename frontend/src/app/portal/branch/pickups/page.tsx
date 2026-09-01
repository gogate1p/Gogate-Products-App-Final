"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  CalendarDays,
  MapPin,
  PackageCheck,
  RefreshCcw,
  Truck,
} from "lucide-react";

import {
  BranchApi,
} from "@/lib/branch-api";

export default function Page() {
  const [rows, setRows] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response =
        await BranchApi.pickups();

      setRows(
        Array.isArray(response)
          ? response
          : response?.data ?? [],
      );
    } catch (err: any) {
      setError(
        err?.message ??
        "Unable to load pickups.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
            Gogate Products
          </div>

          <h1 className="mt-2 text-3xl font-black">
            Pickup Requests
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage customer pickup bookings assigned to this courier branch.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>

          <Link
            href="/portal/branch/pickups/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0284c7] px-4 py-3 text-xs font-black text-white"
          >
            <Truck size={16} />
            Book Pickup
          </Link>

        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,.04)]">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div className="font-black">
            Pickup Queue
          </div>

          <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-[#0284c7]">
            {rows.length}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-bold text-slate-400">
            Loading pickups...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">

            <Truck
              className="mx-auto text-[#0284c7]"
              size={34}
            />

            <div className="mt-4 font-black">
              No pickup requests
            </div>

            <div className="mt-1 text-sm text-slate-400">
              New branch pickup bookings will appear here.
            </div>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {rows.map(
              (
                row,
                index,
              ) => (
                <div
                  key={row.id ?? index}
                  className="grid gap-4 p-5 transition hover:bg-slate-50 lg:grid-cols-[1.3fr_1fr_auto]"
                >

                  <div>

                    <div className="text-lg font-black">
                      {row.pickupCode ?? row.id}
                    </div>

                    <div className="mt-1 text-sm font-bold text-slate-700">
                      {row.customerName}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {row.customerPhone}
                    </div>

                  </div>

                  <div className="space-y-2 text-xs text-slate-500">

                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>
                        {row.address}
                        {row.pinCode ? ` · ${row.pinCode}` : ""}
                      </span>
                    </div>

                    {row.requestedDate && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        <span>
                          {new Date(
                            row.requestedDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <PackageCheck size={14} />
                      <span>
                        {row.packageCount ?? 1} package(s)
                      </span>
                    </div>

                  </div>

                  <div>
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
                      {row.status ?? "BOOKED"}
                    </span>
                  </div>

                </div>
              ),
            )}

          </div>
        )}

      </div>

    </div>
  );
}