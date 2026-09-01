"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Box,
  ChevronRight,
  Plus,
} from "lucide-react";

import {
  CustomerApi,
} from "@/lib/customer-api";

export default function Page() {
  const [rows, setRows] =
    useState<any[]>([]);

  useEffect(() => {
    CustomerApi.shipments()
      .then(
        data =>
          setRows(
            Array.isArray(data)
              ? data
              : [],
          ),
      );
  }, []);

  return (
    <div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h1 className="text-3xl font-black">
            My Shipments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Open any Shipment ID to view tracking, label, invoice, OTP, package and manifest information.
          </p>

        </div>

        <Link
          href="/portal/customer/shipments/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0284c7] px-5 py-3 text-sm font-black text-white"
        >
          <Plus size={17} />
          New Shipment
        </Link>

      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">

        {!rows.length ? (
          <div className="p-12 text-center">

            <Box
              size={35}
              className="mx-auto text-[#0284c7]"
            />

            <div className="mt-4 font-black">
              No shipments found
            </div>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {rows.map(
              shipment => (
                <Link
                  key={shipment.id}
                  href={`/portal/customer/shipments/${shipment.awb}`}
                  className="grid gap-4 p-5 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto] sm:items-center"
                >

                  <div>

                    <div className="text-xl font-black tracking-[.08em] text-[#0284c7]">
                      {shipment.awb}
                    </div>

                    <div className="mt-1 text-xs font-bold text-slate-400">
                      {shipment.serviceType}
                    </div>

                    <div className="mt-2 text-sm text-slate-500">
                      {
                        shipment.order
                          ?.customerDetails
                          ?.receiver
                          ?.name ??
                        "Receiver"
                      }
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-[#0284c7]">
                      {shipment.status}
                    </span>

                    <ChevronRight
                      size={18}
                      className="text-slate-400"
                    />

                  </div>

                </Link>
              ),
            )}

          </div>
        )}

      </div>

    </div>
  );
}