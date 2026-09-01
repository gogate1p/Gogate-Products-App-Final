"use client";

import {
  useState,
} from "react";

import {
  BackendApi,
} from "@/lib/backend-api";

import {
  PortalShell,
  SectionCard,
  StatCard,
} from "@/components/portal/PortalShell";

export default function Page() {
  const [
    value,
    setValue,
  ] =
    useState("");

  const [
    scanType,
    setScanType,
  ] =
    useState(
      "HUB_SCAN",
    );

  const [
    response,
    setResponse,
  ] =
    useState<any>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  async function scan() {
    setError(null);

    try {
      const result =
        await BackendApi
          .scanPackage({
            scanValue:
              value,

            scanType,
          });

      setResponse(
        result,
      );

      setValue("");
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Scan failed",
      );
    }
  }

  return (
    <PortalShell
      title="Operations Staff"
      subtitle="Package scanning and assigned operational tasks."
      badge="Staff"

      nav={[
        {
          href:
            "/portal/staff",
          label:
            "Scanner",
          icon:
            "staff",
        },
        {
          href:
            "/portal/hub",
          label:
            "Hub",
          icon:
            "hub",
        },
        {
          href:
            "/portal/wms",
          label:
            "WMS",
          icon:
            "wms",
        },
      ]}
    >

      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard
          label="Scanner"
          value="Online"
          hint="POST /packages/scan"
          color="green"
        />

        <StatCard
          label="Mode"
          value={scanType}
          hint="Current scan action"
        />

        <StatCard
          label="Device"
          value="Web"
          hint="Operations terminal"
          color="teal"
        />

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        <SectionCard title="Scan Package">

          <div className="space-y-3">

            <select
              value={
                scanType
              }
              onChange={
                (
                  event,
                ) =>
                  setScanType(
                    event.target.value,
                  )
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            >

              <option value="HUB_SCAN">
                Hub Scan
              </option>

              <option value="INBOUND">
                Inbound
              </option>

              <option value="OUTBOUND">
                Outbound
              </option>

              <option value="SORT">
                Sort
              </option>

              <option value="BAG">
                Bag
              </option>

            </select>

            <input
              autoFocus
              value={
                value
              }
              onChange={
                (
                  event,
                ) =>
                  setValue(
                    event.target.value,
                  )
              }
              onKeyDown={
                (
                  event,
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    scan();
                  }
                }
              }
              placeholder="Scan barcode / enter value"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg font-black outline-none focus:border-sky-400"
            />

            <button
              onClick={
                scan
              }
              className="gogate-button w-full rounded-2xl py-4 font-black"
            >
              Submit Scan
            </button>

            {error && (
              <div className="rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700">
                {error}
              </div>
            )}

          </div>

        </SectionCard>

        <SectionCard title="Latest Response">

          <pre className="min-h-52 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs">
            {
              response
                ? JSON.stringify(
                    response,
                    null,
                    2,
                  )
                : "Waiting for scan..."
            }
          </pre>

        </SectionCard>

      </div>

    </PortalShell>
  );
}