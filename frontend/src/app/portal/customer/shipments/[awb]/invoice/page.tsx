"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  CustomerShipmentApi,
} from "@/lib/tracking-api";

export default function Page() {
  const params =
    useParams();

  const awb =
    String(
      params.awb,
    );

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {
    CustomerShipmentApi.detail(
      awb,
    ).then(
      setData,
    );
  }, [
    awb,
  ]);

  if (!data) {
    return (
      <div className="p-10">
        Loading invoice...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl bg-white p-8">

      <div className="flex items-start justify-between">

        <div>

          <div className="text-2xl font-black">
            Gogate Products
          </div>

          <div className="mt-1 text-sm text-slate-500">
            Shipment Invoice
          </div>

        </div>

        <button
          onClick={
            () =>
              window.print()
          }
          className="rounded-xl bg-[#0284c7] px-4 py-2 font-black text-white print:hidden"
        >
          Print Invoice
        </button>

      </div>

      <div className="mt-8 grid gap-4 rounded-3xl bg-slate-50 p-6 sm:grid-cols-2">

        <div>
          <div className="text-xs font-bold text-slate-400">
            AWB
          </div>

          <div className="mt-1 text-xl font-black">
            {data.awb}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400">
            Order ID
          </div>

          <div className="mt-1 font-black">
            {data.order.id}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400">
            Payment Status
          </div>

          <div className="mt-1 font-black">
            {data.order.paymentStatus}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400">
            Service
          </div>

          <div className="mt-1 font-black">
            {data.serviceType}
          </div>
        </div>

      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">

        <div className="flex justify-between text-lg">

          <span className="font-bold">
            Shipment Amount
          </span>

          <span className="font-black">
            ₹{
              Number(
                data.order.totalAmount ??
                0,
              ).toLocaleString(
                "en-IN",
              )
            }
          </span>

        </div>

      </div>

    </main>
  );
}