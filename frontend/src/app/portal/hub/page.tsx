"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  Boxes,
  PackageCheck,
  PackageSearch,
  ScanLine,
  Truck,
  UsersRound,
  Warehouse,
} from "lucide-react";

import {
  HubApi,
} from "@/lib/hub-api";

export default function Page() {
  const [
    data,
    setData,
  ] =
    useState<any>(
      null,
    );

  const [
    hubs,
    setHubs,
  ] =
    useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  async function load() {
    setLoading(true);

    try {
      const hubList =
        await HubApi.hubs();

      setHubs(
        hubList,
      );

      let selected: string | null =
        localStorage.getItem(
          "gogate_hub_id",
        );

      if (
        !selected &&
        hubList.length
      ) {
        selected =
          String(hubList[0].id);

        if (selected) {
  localStorage.setItem(
    "gogate_hub_id",
    selected,
  );
}
      }

      if (selected) {
        setData(
          await HubApi.dashboard(),
        );
      }

      setError(null);
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Unable to load hub dashboard",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(
    () => {
      load();
    },
    [],
  );

  const metrics =
    data?.metrics ??
    {};

  return (
    <div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="text-sm font-black text-[#0284c7]">
            Hub Control Center
          </div>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            {
              data?.hub?.name ??
              "Hub Dashboard"
            }
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Real-time inbound, sortation, dispatch and verification operations.
          </p>

        </div>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black outline-none"
          value={
            typeof window !== "undefined"
              ? localStorage.getItem(
                  "gogate_hub_id",
                ) ?? ""
              : ""
          }
          onChange={
            event => {
              localStorage.setItem(
                "gogate_hub_id",
                event.target.value,
              );

              window.location.reload();
            }
          }
        >

          {hubs.map(
            hub => (
              <option
                key={
                  hub.id
                }
                value={
                  hub.id
                }
              >
                {
                  hub.name
                }
              </option>
            ),
          )}

        </select>

      </div>

      {loading && (
        <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 font-bold text-[#0369a1]">
          Loading hub operations...
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 font-bold text-orange-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Metric
          icon={
            PackageSearch
          }
          label="Inbound"
          value={
            metrics.inbound ??
            0
          }
          hint="Expected / incoming"
        />

        <Metric
          icon={
            Truck
          }
          label="Outbound"
          value={
            metrics.outbound ??
            0
          }
          hint="Ready for dispatch"
        />

        <Metric
          icon={
            PackageCheck
          }
          label="At Hub"
          value={
            metrics.atHub ??
            0
          }
          hint="Current inventory"
        />

        <Metric
          icon={
            ScanLine
          }
          label="Scans Today"
          value={
            metrics.scansToday ??
            0
          }
          hint="Hub scan activity"
        />

        <Metric
          icon={
            Boxes
          }
          label="Open Bags"
          value={
            metrics.openBags ??
            0
          }
          hint="Awaiting closure"
        />

        <Metric
          icon={
            Warehouse
          }
          label="Manifests"
          value={
            metrics.manifests ??
            0
          }
          hint="Active manifests"
        />

        <Metric
          icon={
            UsersRound
          }
          label="Pending KYC"
          value={
            metrics.pendingKyc ??
            0
          }
          hint="Verification queue"
        />

        <Metric
          icon={
            AlertTriangle
          }
          label="Exceptions"
          value={
            metrics.exceptions ??
            0
          }
          hint="Requires action"
          warning
        />

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">

        <section className="gogate-card p-6">

          <h2 className="text-lg font-black">
            Operations Flow
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Standard hub handling sequence.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">

            {[
              [
                "01",
                "Inbound Scan",
                "Receive packages",
              ],
              [
                "02",
                "Sort",
                "Route by destination",
              ],
              [
                "03",
                "Bag / Manifest",
                "Build dispatch load",
              ],
              [
                "04",
                "Outbound Scan",
                "Release to transport",
              ],
            ].map(
              item => (
                <div
                  key={
                    item[0]
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >

                  <div className="text-xs font-black text-[#0284c7]">
                    {
                      item[0]
                    }
                  </div>

                  <div className="mt-3 font-black">
                    {
                      item[1]
                    }
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {
                      item[2]
                    }
                  </div>

                </div>
              ),
            )}

          </div>

        </section>

        <section className="gogate-card p-6">

          <h2 className="font-black">
            Hub Health
          </h2>

          <div className="mt-5 space-y-4">

            <Health
              title="Scanning"
              status="Operational"
            />

            <Health
              title="Workforce"
              status="Active"
            />

            <Health
              title="Dispatch"
              status="Operational"
            />

            <Health
              title="Database"
              status="Connected"
            />

          </div>

        </section>

      </div>

    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  warning = false,
}: any) {
  return (
    <div className="gogate-card soft-hover p-5">

      <div
        className={`grid h-11 w-11 place-items-center rounded-2xl ${
          warning
            ? "bg-orange-50 text-orange-600"
            : "bg-sky-50 text-[#0284c7]"
        }`}
      >
        <Icon size={21} />
      </div>

      <div className="mt-5 text-3xl font-black">
        {value}
      </div>

      <div className="mt-1 font-black">
        {label}
      </div>

      <div className="mt-1 text-xs text-slate-500">
        {hint}
      </div>

    </div>
  );
}

function Health({
  title,
  status,
}: {
  title:
    string;

  status:
    string;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-sm font-bold text-slate-600">
        {title}
      </span>

      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
        {status}
      </span>

    </div>
  );
}