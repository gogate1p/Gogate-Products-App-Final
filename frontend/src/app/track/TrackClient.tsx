"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  publicTrack,
} from "@/lib/shipment-tracking-api";

import {
  ShipmentProgress,
} from "@/components/tracking/ShipmentProgress";

export default function TrackClient() {
  const params =
    useSearchParams();

  const initial =
    params.get("awb") ??
    "";

  const [awb, setAwb] =
    useState(
      initial,
    );

  const [data, setData] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [lastRefresh, setLastRefresh] =
    useState<Date | null>(
      null,
    );

  async function load(
    value = awb,
    silent = false,
  ) {
    if (!value.trim()) {
      setError(
        "Enter your 12-digit Shipment ID.",
      );

      return;
    }

    if (!silent) {
      setLoading(true);
    }

    try {

      const result =
        await publicTrack(
          value.trim(),
        );

      setData(
        result,
      );

      setLastRefresh(
        new Date(),
      );

      setError("");

    } catch (error: any) {

      if (!silent) {
        setData(null);

        setError(
          error.message ??
          "Shipment not found.",
        );
      }

    } finally {

      if (!silent) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (initial) {
      load(
        initial,
      );
    }
  }, []);

  useEffect(() => {
    if (!data?.awb) {
      return;
    }

    const timer =
      window.setInterval(
        () =>
          load(
            data.awb,
            true,
          ),
        15000,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, [
    data?.awb,
  ]);

  return (
    <main className="min-h-screen bg-[#f5f7f6]">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-5 py-7">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xl font-black">
                Gogate Products
              </div>

              <div className="mt-1 text-xs font-bold uppercase tracking-[.13em] text-slate-400">
                Shipment Tracking
              </div>

            </div>


            {lastRefresh && (
              <div className="hidden items-center gap-2 text-xs font-bold text-slate-400 sm:flex">

                <span className="relative flex h-2 w-2">

                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative h-2 w-2 rounded-full bg-[#159447]" />

                </span>

                Auto updating

              </div>
            )}

          </div>


          <div className="mt-6 flex max-w-2xl gap-2">

            <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                value={awb}
                maxLength={12}
                inputMode="numeric"
                onChange={
                  event =>
                    setAwb(
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                }
                onKeyDown={
                  event => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      load();
                    }
                  }
                }
                placeholder="Enter 12-digit Shipment ID"
                className="min-w-0 flex-1 bg-transparent px-3 py-4 font-black tracking-[.08em] outline-none"
              />

            </div>

            <button
              onClick={
                () =>
                  load()
              }
              disabled={loading}
              className="rounded-2xl bg-[#159447] px-5 font-black text-white shadow-[0_10px_28px_rgba(21,148,71,.18)] disabled:opacity-60 sm:px-7"
            >
              {
                loading
                  ? "Checking"
                  : "Track"
              }
            </button>

          </div>


          {error && (
            <div className="mt-4 max-w-2xl rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

        </div>

      </header>


      {data && (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-7 sm:px-5">

          <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,.055)]">

            <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-white p-5 sm:p-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <div className="text-[10px] font-black uppercase tracking-[.19em] text-slate-400">
                    Shipment ID
                  </div>

                  <div className="mt-2 break-all text-2xl font-black tracking-[.08em] text-slate-900 sm:text-4xl">
                    {data.awb}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-black uppercase text-[#117b3c]">
                      {
                        String(
                          data.status,
                        ).replaceAll(
                          "_",
                          " ",
                        )
                      }
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-600">
                      {data.serviceType}
                    </span>

                  </div>

                </div>


                <div className="rounded-2xl border border-emerald-100 bg-white p-4 sm:min-w-[220px]">

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">

                    <CalendarDays size={15} />

                    Expected delivery

                  </div>

                  <div className="mt-2 text-lg font-black text-slate-900">
                    {
                      new Date(
                        data.expectedDeliveryAt,
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          weekday:
                            "short",

                          day:
                            "numeric",

                          month:
                            "long",

                          year:
                            "numeric",
                        },
                      )
                    }
                  </div>

                </div>

              </div>

            </div>


            <div className="p-5 sm:p-8">

              <ShipmentProgress
                steps={
                  data.timeline
                }
              />

            </div>

          </section>


          <section className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-7">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-black">
                  Shipment updates
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest processing events for this shipment.
                </p>

              </div>

              <button
                onClick={
                  () =>
                    load(
                      data.awb,
                    )
                }
                className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-500"
              >
                <RefreshCw size={17} />
              </button>

            </div>


            <div className="mt-7">

              {!data.updates?.length ? (
                <Update
                  icon={PackageCheck}
                  title="Shipment Created"
                  time={
                    data.createdAt
                  }
                  last
                />
              ) : (
                data.updates.map(
                  (
                    item: any,
                    index: number,
                  ) => (
                    <Update
                      key={`${item.timestamp}-${index}`}
                      icon={
                        item.status ===
                        "DELIVERED"
                          ? CheckCircle2
                          : item.status ===
                            "OUT_FOR_DELIVERY"
                            ? Truck
                            : Clock3
                      }
                      title={
                        item.message ??
                        String(
                          item.status,
                        )
                          .replaceAll(
                            "_",
                            " ",
                          )
                      }
                      time={
                        item.timestamp
                      }
                      extra={
                        item.hubCode ??
                        null
                      }
                      last={
                        index ===
                        data.updates.length -
                        1
                      }
                    />
                  ),
                )
              )}

            </div>

          </section>


          <div className="grid gap-6 lg:grid-cols-2">

            <section className="rounded-[28px] border border-slate-200 bg-white p-6">

              <h2 className="font-black">
                Shipment information
              </h2>

              <Detail
                label="Sender"
                value={
                  data.sender?.name ??
                  "—"
                }
              />

              <Detail
                label="Receiver"
                value={
                  data.receiver?.name ??
                  "—"
                }
              />

              <Detail
                label="Destination"
                value={
                  data.receiver?.city ??
                  "—"
                }
              />

              {data.receivedBy && (
                <Detail
                  label="Received by"
                  value={
                    data.receivedBy
                  }
                />
              )}

            </section>


            <section className="rounded-[28px] border border-slate-200 bg-white p-6">

              <h2 className="font-black">
                Shipment assurance
              </h2>

              <div className="mt-5 flex gap-3 rounded-2xl bg-emerald-50 p-4">

                <ShieldCheck
                  size={21}
                  className="shrink-0 text-[#159447]"
                />

                <p className="text-xs leading-5 text-slate-600">
                  Public tracking intentionally hides phone numbers, exact addresses, OTPs, payment details, internal manifests and operational security information.
                </p>

              </div>

              <div className="mt-4 flex gap-3 rounded-2xl bg-slate-50 p-4">

                <PackageCheck
                  size={21}
                  className="shrink-0 text-slate-500"
                />

                <p className="text-xs leading-5 text-slate-600">
                  Normal courier shipments show an expected delivery date rather than a minute-by-minute live ETA.
                </p>

              </div>

            </section>

          </div>

        </div>
      )}

    </main>
  );
}

function Update({
  icon: Icon,
  title,
  time,
  extra,
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

        <div className="font-black text-slate-900">
          {title}
        </div>

        {extra && (
          <div className="mt-1 text-xs font-black text-[#159447]">
            {extra}
          </div>
        )}

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

function Detail({
  label,
  value,
}: any) {
  return (
    <div className="mt-5 border-b border-slate-100 pb-4 last:border-none">

      <div className="text-xs font-bold text-slate-400">
        {label}
      </div>

      <div className="mt-1 font-black text-slate-800">
        {value}
      </div>

    </div>
  );
}