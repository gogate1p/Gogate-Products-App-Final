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
    packageId,
    setPackageId,
  ] =
    useState("");

  const [
    packageData,
    setPackageData,
  ] =
    useState<any>(
      null,
    );

  const [
    scans,
    setScans,
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

  async function lookup() {
    if (!packageId) {
      return;
    }

    setError(null);

    try {
      const [
        detail,
        scanHistory,
      ] =
        await Promise.all([
          BackendApi
            .package(
              packageId,
            ),

          BackendApi
            .packageScans(
              packageId,
            ),
        ]);

      setPackageData(
        detail,
      );

      setScans(
        scanHistory,
      );
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Package lookup failed",
      );
    }
  }

  return (
    <PortalShell
      title="Warehouse Management"
      subtitle="Inventory-facing package lookup and scan history."
      badge="WMS"

      nav={[
        {
          href:
            "/portal/wms",
          label:
            "Warehouse",
          icon:
            "wms",
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
            "/portal/staff",
          label:
            "Staff Scanner",
          icon:
            "staff",
        },
      ]}
    >

      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard
          label="Package API"
          value="Live"
          hint="Package detail lookup"
          color="green"
        />

        <StatCard
          label="Scan History"
          value="Live"
          hint="Package event history"
          color="teal"
        />

        <StatCard
          label="WMS"
          value="Phase 1"
          hint="Uses existing package APIs"
        />

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.65fr_1.35fr]">

        <SectionCard title="Package Lookup">

          <input
            value={
              packageId
            }
            onChange={
              (
                event,
              ) =>
                setPackageId(
                  event.target.value,
                )
            }
            placeholder="Package ID"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400"
          />

          <button
            onClick={
              lookup
            }
            className="gogate-button mt-3 w-full rounded-2xl py-3 font-black"
          >
            Find Package
          </button>

          {error && (
            <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700">
              {error}
            </div>
          )}

        </SectionCard>

        <SectionCard title="Package Information">

          <div className="grid gap-4 lg:grid-cols-2">

            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs">
              {
                packageData
                  ? JSON.stringify(
                      packageData,
                      null,
                      2,
                    )
                  : "Package details"
              }
            </pre>

            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-sky-50 p-4 text-xs">
              {
                scans
                  ? JSON.stringify(
                      scans,
                      null,
                      2,
                    )
                  : "Scan history"
              }
            </pre>

          </div>

        </SectionCard>

      </div>

    </PortalShell>
  );
}