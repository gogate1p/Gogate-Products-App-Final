"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Box,
  CircleCheckBig,
  CircleAlert,
  Headphones,
  MapPinned,
  PackagePlus,
  Truck,
} from "lucide-react";

import {
  CustomerApi,
} from "@/lib/customer-api";

export default function Page() {
  const [data, setData] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    CustomerApi.dashboard()
      .then(setData)
      .catch(
        (error: any) =>
          setError(
            error.message,
          ),
      );
  }, []);

  const stats =
    data?.stats ?? {};

  const customer =
    data?.customer ?? {};

  const displayName =
    customer.email
      ? customer.email
          .split("@")[0]
          .replace(/[._-]/g, " ")
      : customer.phone
        ? `Customer ${customer.phone.slice(-4)}`
        : "Customer";

  return (
    <div className="mx-auto max-w-7xl">

      <div>

        <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
          Customer Dashboard
        </div>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Welcome, {displayName}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage deliveries, addresses, payments and customer care.
        </p>

      </div>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Metric
          icon={Box}
          value={stats.total ?? 0}
          label="Total Shipments"
        />

        <Metric
          icon={Truck}
          value={stats.active ?? 0}
          label="In Progress"
        />

        <Metric
          icon={CircleCheckBig}
          value={stats.delivered ?? 0}
          label="Delivered"
        />

        <Metric
          icon={CircleAlert}
          value={stats.exceptions ?? 0}
          label="Needs Attention"
        />

      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Action
          href="/portal/customer/shipments/new"
          icon={PackagePlus}
          title="Send a Package"
          text="Normal or hyperlocal delivery"
        />

        <Action
          href="/portal/customer/addresses"
          icon={MapPinned}
          title="Manage Addresses"
          text={`${stats.addresses ?? 0} saved addresses`}
        />

        <Action
          href="/portal/customer/payments"
          icon={Box}
          title="Payment Methods"
          text="Manage payment preferences"
        />

        <Action
          href="/portal/customer/support"
          icon={Headphones}
          title="Customer Care"
          text={`${stats.openTickets ?? 0} open conversations`}
        />

      </div>

      <section className="mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white">

        <div className="border-b border-slate-100 p-5 sm:p-6">

          <h2 className="font-black text-slate-900">
            Recent Shipments
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Click the shipment ID to view tracking.
          </p>

        </div>

        {!data?.recentShipments?.length ? (
          <div className="p-12 text-center">

            <Box
              size={34}
              className="mx-auto text-[#0284c7]"
            />

            <div className="mt-4 font-black">
              No shipments yet
            </div>

            <Link
              href="/portal/customer/shipments/new"
              className="mt-4 inline-block rounded-2xl bg-[#0284c7] px-5 py-3 text-sm font-black text-white"
            >
              Send your first package
            </Link>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {data.recentShipments.map(
              (shipment: any) => (
                <div
                  key={shipment.id}
                  className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
                >

                  <div>

                    <Link
                      href={`/track?awb=${encodeURIComponent(
                        shipment.awb,
                      )}`}
                      className="text-lg font-black tracking-wide text-[#0284c7] hover:underline"
                    >
                      {shipment.awb}
                    </Link>

                    <div className="mt-1 text-xs font-bold text-slate-400">
                      {shipment.serviceType}
                    </div>

                  </div>

                  <span className="w-fit rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-black text-[#0284c7]">
                    {shipment.status}
                  </span>

                </div>
              ),
            )}

          </div>
        )}

      </section>

    </div>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
}: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,.04)]">

      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
        <Icon size={20} />
      </div>

      <div className="mt-5 text-3xl font-black">
        {value}
      </div>

      <div className="mt-1 text-sm font-bold text-slate-500">
        {label}
      </div>

    </div>
  );
}

function Action({
  href,
  icon: Icon,
  title,
  text,
}: any) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <Icon
        className="text-[#0284c7]"
        size={23}
      />

      <div className="mt-4 font-black">
        {title}
      </div>

      <div className="mt-1 text-xs text-slate-500">
        {text}
      </div>
    </Link>
  );
}