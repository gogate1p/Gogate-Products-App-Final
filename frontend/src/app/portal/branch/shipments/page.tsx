"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  Box,
  PackageSearch,
  RefreshCcw,
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
        await BranchApi.shipments();

      setRows(
        Array.isArray(response)
          ? response
          : response?.data ?? [],
      );
    } catch (err: any) {
      setError(
        err?.message ??
        "Unable to load shipments.",
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
            Branch Shipments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View all shipments booked through this courier branch.
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
            href="/portal/branch/book"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0284c7] px-4 py-3 text-xs font-black text-white"
          >
            <Box size={16} />
            New Shipment
          </Link>

        </div>

      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div className="font-black">
            Shipment Register
          </div>

          <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-[#0284c7]">
            {rows.length}
          </div>

        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-bold text-slate-400">
            Loading shipments...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">

            <PackageSearch
              size={34}
              className="mx-auto text-[#0284c7]"
            />

            <div className="mt-4 font-black">
              No branch shipments
            </div>

            <div className="mt-1 text-sm text-slate-400">
              New bookings will appear here.
            </div>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {rows.map(
              (
                row,
                index,
              ) => {
                const customer =
                  row.order?.customerDetails ??
                  {};

                return (
                  <div
                    key={row.id ?? index}
                    className="grid gap-4 p-5 transition hover:bg-slate-50 lg:grid-cols-[1.2fr_1fr_auto]"
                  >

                    <div>

                      <div className="text-lg font-black tracking-wide">
                        {row.awb}
                      </div>

                      <div className="mt-1 text-xs font-black text-[#0284c7]">
                        {row.serviceType ?? "NORMAL"}
                      </div>

                    </div>

                    <div>

                      <div className="text-sm font-black">
                        {customer.name ?? "Customer"}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {customer.phone ?? ""}
                      </div>

                      <div className="mt-2 text-xs text-slate-400">
                        {
                          row.originHub?.name
                            ? `${row.originHub.name} → ${row.destinationHub?.name ?? "Destination"}`
                            : ""
                        }
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-black text-[#0284c7]">
                        {row.status ?? "PENDING"}
                      </span>

                      <Link
                        href={`/track?awb=${encodeURIComponent(
                          row.awb,
                        )}`}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"
                      >
                        <ArrowUpRight size={16} />
                      </Link>

                    </div>

                  </div>
                );
              },
            )}

          </div>
        )}

      </div>

    </div>
  );
}