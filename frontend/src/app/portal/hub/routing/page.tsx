"use client";

import {
  useState,
} from "react";

import {
  ArrowRight,
  Clock3,
  PackageSearch,
  RefreshCw,
  Route,
  Truck,
  Warehouse,
} from "lucide-react";

import {
  HubRoutingApi,
} from "@/lib/hub-routing-api";

export default function Page() {
  const [awb, setAwb] =
    useState("");

  const [data, setData] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function find() {
    if (!awb) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      setData(
        await HubRoutingApi.shipment(
          awb,
        ),
      );
    } catch (error: any) {
      setError(
        error.message,
      );
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    if (!data?.shipment?.awb) {
      return;
    }

    setData(
      await HubRoutingApi.refresh(
        data.shipment.awb,
      ),
    );
  }

  const routing =
    data?.routing;

  return (
    <div className="mx-auto max-w-6xl">

      <div className="text-xs font-black uppercase tracking-[.18em] text-[#08783d]">
        Hub Routing Control
      </div>

      <h1 className="mt-2 text-3xl font-black">
        Shipment Placement & Dispatch
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Scan or enter an AWB to see where to stage it and its next network movement.
      </p>


      <div className="mt-6 flex max-w-2xl gap-2">

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
          placeholder="Scan / enter shipment AWB"
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-4 font-black tracking-wider outline-none focus:border-emerald-500"
        />

        <button
          onClick={find}
          className="rounded-2xl bg-[#08783d] px-6 font-black text-white"
        >
          {
            loading
              ? "Checking..."
              : "Find"
          }
        </button>

      </div>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error}
        </div>
      )}


      {routing && (
        <div className="mt-7">

          <section className="rounded-[30px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-6 sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <div className="text-xs font-black uppercase text-emerald-700">
                  Staff instruction
                </div>

                <div className="mt-2 text-2xl font-black">
                  {routing.instruction}
                </div>

              </div>

              <button
                onClick={refresh}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black shadow-sm"
              >
                <RefreshCw size={16} />
                Recalculate
              </button>

            </div>


            <div className="mt-7 grid gap-4 sm:grid-cols-3">

              <LargeCard
                icon={Warehouse}
                label="Keep At"
                value={
                  [
                    routing.stagingZone,
                    routing.stagingLane,
                    routing.stagingRack,
                  ]
                    .filter(
                      Boolean,
                    )
                    .join(" / ") ||
                  "Route staging"
                }
              />

              <LargeCard
                icon={ArrowRight}
                label="Next Hub"
                value={
                  routing.nextHubCode ??
                  "Pending"
                }
              />

              <LargeCard
                icon={Truck}
                label="Trip"
                value={
                  routing.plannedTripCode ??
                  "Awaiting truck"
                }
              />

            </div>

          </section>


          <div className="mt-5 grid gap-4 md:grid-cols-3">

            <SmallCard
              icon={Clock3}
              label="Next Truck"
              value={
                routing.truckExpectedAt
                  ? new Date(
                      routing.truckExpectedAt,
                    ).toLocaleString(
                      "en-IN",
                    )
                  : "No arrival scheduled"
              }
            />

            <SmallCard
              icon={Truck}
              label="Dispatch"
              value={
                routing.plannedDispatchAt
                  ? new Date(
                      routing.plannedDispatchAt,
                    ).toLocaleString(
                      "en-IN",
                    )
                  : "Awaiting schedule"
              }
            />

            <SmallCard
              icon={Route}
              label="Route"
              value={
                `${routing.currentHubCode ?? "—"} → ${routing.nextHubCode ?? "—"}`
              }
            />

          </div>

        </div>
      )}

    </div>
  );
}

function LargeCard({
  icon: Icon,
  label,
  value,
}: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">

      <Icon
        size={21}
        className="text-[#08783d]"
      />

      <div className="mt-4 text-xs font-bold text-slate-400">
        {label}
      </div>

      <div className="mt-1 text-xl font-black">
        {value}
      </div>

    </div>
  );
}

function SmallCard({
  icon: Icon,
  label,
  value,
}: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">

      <div className="flex items-center gap-2 text-slate-500">

        <Icon size={17} />

        <span className="text-xs font-black">
          {label}
        </span>

      </div>

      <div className="mt-3 font-black">
        {value}
      </div>

    </div>
  );
}