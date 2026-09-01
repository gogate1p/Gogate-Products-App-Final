"use client";

import {
  useState,
} from "react";

import {
  PortalShell,
  SectionCard,
} from "@/components/portal/PortalShell";

function Toggle({
  label,
  description,
  initial = true,
}: {
  label:
    string;

  description:
    string;

  initial?:
    boolean;
}) {
  const [
    enabled,
    setEnabled,
  ] =
    useState(
      initial,
    );

  return (
    <button
      onClick={
        () =>
          setEnabled(
            !enabled,
          )
      }
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-200"
    >

      <span>

        <span className="block font-black">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>

      </span>

      <span
        className={`shrink-0 rounded-full p-1 transition ${
          enabled
            ? "bg-[#0284c7]"
            : "bg-slate-300"
        }`}
      >

        <span
          className={`block h-5 w-5 rounded-full bg-white shadow transition ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />

      </span>

    </button>
  );
}

export default function Page() {
  return (
    <PortalShell
      title="Portal & System Settings"
      subtitle="Central administrative configuration."
      badge="Admin only"

      nav={[
        {
          href:
            "/portal/admin",
          label:
            "Control Center",
          icon:
            "admin",
        },
        {
          href:
            "/portal/admin/verifications",
          label:
            "Verifications",
          icon:
            "verify",
        },
        {
          href:
            "/portal/admin/tenants",
          label:
            "Tenants",
          icon:
            "business",
        },
        {
          href:
            "/portal/admin/settings",
          label:
            "Settings",
          icon:
            "settings",
        },
      ]}
    >

      <div className="grid gap-6 xl:grid-cols-2">

        <SectionCard title="Portal Availability">

          <div className="space-y-3">

            <Toggle
              label="Customer Portal"
              description="Shipment tracking, delivery and support workspace."
            />

            <Toggle
              label="Merchant Portal"
              description="Business shipping portal with KYC gate."
            />

            <Toggle
              label="Shipper Portal"
              description="Bulk shipment and manifest portal."
            />

            <Toggle
              label="Hub Portal"
              description="Hub inbound, outbound and sort operations."
            />

            <Toggle
              label="Dispatcher Portal"
              description="Allocation and dispatch control center."
            />

            <Toggle
              label="Staff Portal"
              description="Role-limited operational workflows."
            />

            <Toggle
              label="WMS Portal"
              description="Warehouse management operations."
            />

            <Toggle
              label="Customer Care"
              description="Support and live-chat workspace."
            />

          </div>

        </SectionCard>

        <SectionCard title="Platform Controls">

          <div className="space-y-3">

            <Toggle
              label="Business KYC Enforcement"
              description="Block Merchant / Shipper functions until verified."
            />

            <Toggle
              label="Customer Live Tracking"
              description="Expose approved tracking events to customers."
            />

            <Toggle
              label="Dynamic ETA"
              description="Allow dynamic delivery ETA calculations."
            />

            <Toggle
              label="Strict RBAC"
              description="Enforce portal role permissions on backend."
            />

            <Toggle
              label="Audit Logging"
              description="Record critical administrative actions."
            />

            <Toggle
              label="Pidge Provider"
              description="Enable Pidge provider integration after credentials are configured."
              initial={false}
            />

          </div>

        </SectionCard>

      </div>

      <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">

        <div className="font-black text-orange-700">
          Important
        </div>

        <p className="mt-2 text-sm leading-6 text-orange-700">
          These UI controls currently represent configuration screens.
          Persistent settings require corresponding backend configuration endpoints.
        </p>

      </div>

    </PortalShell>
  );
}