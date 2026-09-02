"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  CreditCard,
  KeyRound,
  MapPin,
  PackageCheck,
  Printer,
  Receipt,
  Truck,
} from "lucide-react";

import {
  CustomerTrackingApi,
} from "@/lib/shipment-tracking-api";

import {
  ShipmentProgress,
} from "@/components/tracking/ShipmentProgress";
import HyperlocalMap from "@/components/tracking/HyperlocalMap";

export default function Page() {
  const params =
    useParams();

  const awb =
    String(
      params.awb,
    );

  const [data, setData] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  async function load() {

    try {

      const result =
        await CustomerTrackingApi.details(
          awb,
        );

      setData(
        result,
      );

      setError("");

    } catch (error: any) {

      setError(
        error.message,
      );
    }
  }

  useEffect(() => {
    load();

    const timer =
      window.setInterval(
        load,
        15000,
      );

    return () =>
      window.clearInterval(
        timer,
      );

  }, [
    awb,
  ]);


  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 font-bold text-red-600">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center font-bold text-slate-400">
        Loading shipment...
      </div>
    );
  }


  const shipment =
    data.shipment;

  const sender =
    data.sender ??
    {};

  const receiver =
    data.receiver ??
    {};

  return (
    <div className="mx-auto max-w-7xl">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

        <div>

          <div className="text-xs font-black uppercase tracking-[.18em] text-[#159447]">
            Shipment
          </div>

          <h1 className="mt-2 break-all text-3xl font-black tracking-[.08em] sm:text-4xl">
            {shipment.awb}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2">

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-[#159447]">
              {
                String(
                  shipment.status,
                ).replaceAll(
                  "_",
                  " ",
                )
              }
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
              {shipment.serviceType}
            </span>

          </div>

        </div>


        <div className="flex flex-wrap gap-2">

          <Link
            href={`/portal/customer/shipments/${shipment.awb}/label`}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black"
          >
            <Printer size={16} />
            Label
          </Link>

          <Link
            href={`/portal/customer/shipments/${shipment.awb}/invoice`}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black"
          >
            <Receipt size={16} />
            Invoice
          </Link>

        </div>

      </div>


      {/* TRACKING FIRST */}

      <section className="mt-7 rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,.045)] sm:p-8">

        <div className="mb-7">

          <h2 className="text-lg font-black">
            Shipment progress
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Updates automatically as your shipment moves through the network.
          </p>

        </div>

        <ShipmentProgress
          steps={
            data.timeline
          }
        />

      </section>

      {String(shipment.serviceType).toUpperCase() === "HYPERLOCAL" && data.locations && (
        <section className="mt-5 rounded-[30px] border border-sky-100 bg-sky-50/60 p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[.18em] text-sky-700">Hyperlocal live view</div>
              <h2 className="mt-2 text-xl font-black text-slate-900">Pickup to delivery route</h2>
              <p className="mt-1 text-xs text-slate-500">Live rider location is shown only while this hyperlocal order is active.</p>
            </div>
            {data.etaMinutes != null && <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm"><div className="text-[10px] font-black uppercase tracking-wide text-slate-400">Expected arrival</div><div className="mt-1 text-lg font-black text-slate-900">{data.etaMinutes} min</div></div>}
          </div>
          <HyperlocalMap merchant={data.locations.merchant} customer={data.locations.customer} rider={data.locations.rider} />
        </section>
      )}

      {/* ALL SHIPMENT UPDATES DIRECTLY BELOW TRACKING */}

      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 sm:p-7">

        <h2 className="text-lg font-black">
          All shipment updates
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Complete operational history for this shipment.
        </p>


        <div className="mt-7">

          {!shipment.events?.length ? (
            <PrivateUpdate
              icon={PackageCheck}
              title="Shipment Created"
              time={
                shipment.createdAt
              }
              last
            />
          ) : (
            shipment.events
              .slice()
              .reverse()
              .map(
                (
                  event: any,
                  index: number,
                ) => (
                  <PrivateUpdate
                    key={
                      event.id ??
                      index
                    }
                    icon={
                      event.status ===
                      "DELIVERED"
                        ? CheckCircle2
                        : event.status ===
                          "OUT_FOR_DELIVERY"
                          ? Truck
                          : Clock3
                    }
                    title={
                      String(
                        event.status,
                      ).replaceAll(
                        "_",
                        " ",
                      )
                    }
                    time={
                      event.timestamp
                    }
                    last={
                      index ===
                      shipment.events.length -
                      1
                    }
                  />
                ),
              )
          )}

        </div>

      </section>


      {/* PICKUP OTP ONLY WHEN BACKEND SUPPLIES IT */}

      {data.pickupOtp && (
        <section className="mt-5 rounded-[28px] border border-amber-200 bg-amber-50 p-6">

          <div className="flex gap-4">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <KeyRound size={20} />
            </div>

            <div>

              <div className="font-black text-amber-900">
                Pickup verification OTP
              </div>

              <div className="mt-2 text-4xl font-black tracking-[.18em]">
                {data.pickupOtp.otp}
              </div>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Share this OTP only with the Gogate Products pickup executive at the time of physical collection.
              </p>

            </div>

          </div>

        </section>
      )}


      <div className="mt-5 grid gap-5 lg:grid-cols-2">

        <Address
          title="Sender / Pickup"
          data={sender}
        />

        <Address
          title="Receiver / Delivery"
          data={receiver}
        />

      </div>


      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6">

        <div className="flex items-center gap-2">

          <CreditCard
            size={19}
            className="text-[#159447]"
          />

          <h2 className="font-black">
            Payment details
          </h2>

        </div>


        <div className="mt-5 grid gap-4 sm:grid-cols-3">

          <Info
            label="Payment Type"
            value={
              data.payment.method
            }
          />

          <Info
            label="Shipment Amount"
            value={`₹${Number(
              data.payment.amount ??
              0,
            ).toLocaleString(
              "en-IN",
            )}`}
          />

          <Info
            label="Amount to Collect"
            value={
              data.payment.method ===
              "COD"
                ? `₹${Number(
                    data.payment.amountToCollect ??
                    0,
                  ).toLocaleString(
                    "en-IN",
                  )}`
                : "₹0 · PREPAID"
            }
          />

        </div>

      </section>


      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6">

        <h2 className="font-black">
          Packages
        </h2>

        <div className="mt-5 space-y-3">

          {shipment.packages?.map(
            (
              pkg: any,
            ) => (
              <div
                key={pkg.id}
                className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3"
              >

                <Info
                  label="Barcode"
                  value={
                    pkg.barcode
                  }
                />

                <Info
                  label="Weight"
                  value={
                    pkg.weight
                      ? `${pkg.weight} kg`
                      : "—"
                  }
                />

                <Info
                  label="Status"
                  value={
                    pkg.status
                  }
                />

              </div>
            ),
          )}

        </div>

      </section>


      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6">

        <h2 className="font-black">
          Manifest information
        </h2>

        <div className="mt-5">

          {!data.manifests?.length ? (
            <div className="text-sm text-slate-400">
              Shipment has not yet been added to a manifest.
            </div>
          ) : (
            data.manifests.map(
              (
                manifest: any,
              ) => (
                <div
                  key={manifest.id}
                  className="mb-3 rounded-2xl bg-slate-50 p-4"
                >

                  <div className="font-black">
                    {manifest.manifestNumber}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {manifest.type} · {manifest.status}
                  </div>

                </div>
              ),
            )
          )}

        </div>

      </section>

    </div>
  );
}

function PrivateUpdate({
  icon: Icon,
  title,
  time,
  last,
}: any) {
  return (
    <div className="relative flex gap-4 pb-7">

      <div className="relative">

        <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-[#159447]">
          <Icon size={18} />
        </div>

        {!last && (
          <div className="absolute left-1/2 top-11 h-[calc(100%+4px)] w-[2px] -translate-x-1/2 bg-emerald-100" />
        )}

      </div>

      <div className="pt-1">

        <div className="font-black">
          {title}
        </div>

        <div className="mt-1 text-xs text-slate-400">
          {
            new Date(
              time,
            ).toLocaleString(
              "en-IN",
            )
          }
        </div>

      </div>

    </div>
  );
}

function Address({
  title,
  data,
}: any) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6">

      <div className="flex items-center gap-2">

        <MapPin
          size={18}
          className="text-[#159447]"
        />

        <h2 className="font-black">
          {title}
        </h2>

      </div>

      <div className="mt-5 font-black">
        {data.name ?? "—"}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {data.phone ?? "—"}
      </div>

      <div className="mt-3 text-sm leading-6 text-slate-500">
        {data.address ?? "—"}
        <br />
        {data.city ?? ""}
        {
          data.pinCode
            ? ` - ${data.pinCode}`
            : ""
        }
      </div>

    </section>
  );
}

function Info({
  label,
  value,
}: any) {
  return (
    <div>

      <div className="text-xs font-bold text-slate-400">
        {label}
      </div>

      <div className="mt-1 font-black">
        {value}
      </div>

    </div>
  );
}