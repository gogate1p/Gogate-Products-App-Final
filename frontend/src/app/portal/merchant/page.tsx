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
    result,
    setResult,
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

  const [
    form,
    setForm,
  ] =
    useState({
      tenantId:
        "",

      orderId:
        "",

      awb:
        "",

      serviceType:
        "NORMAL",
    });

  async function createShipment() {
    setError(null);

    try {
      const response =
        await BackendApi
          .createShipment(
            form,
          );

      setResult(
        response,
      );
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Shipment creation failed",
      );
    }
  }

  return (
    <PortalShell
      title="Business Shipping Portal"
      subtitle="Merchant / Shipper shipment operations."
      badge="KYC verified access"

      nav={[
        {
          href:
            "/portal/merchant",
          label:
            "Dashboard",
          icon:
            "business",
        },
        {
          href:
            "/portal/merchant/kyc",
          label:
            "Business KYC",
          icon:
            "verify",
        },
        {
          href:
            "/track",
          label:
            "Tracking",
          icon:
            "shipments",
        },
        {
          href:
            "/portal/support",
          label:
            "Support",
          icon:
            "support",
        },
      ]}
    >

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Shipping"
          value="Live"
          hint="Connected to backend"
          color="green"
        />

        <StatCard
          label="KYC"
          value="Required"
          hint="Admin verification gate"
          color="orange"
        />

        <StatCard
          label="Provider"
          value="Internal"
          hint="Gogate shipment API"
        />

        <StatCard
          label="Tracking"
          value="Enabled"
          hint="AWB tracking"
          color="teal"
        />

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">

        <SectionCard
          title="Create Shipment"
          subtitle="POST /shipments"
        >

          <div className="space-y-3">

            {Object.entries(
              form,
            ).map(
              (
                [
                  key,
                  value,
                ],
              ) => (
                <input
                  key={
                    key
                  }
                  value={
                    value
                  }
                  onChange={
                    (
                      event,
                    ) =>
                      setForm(
                        {
                          ...form,

                          [
                            key
                          ]:
                            event.target.value,
                        },
                      )
                  }
                  placeholder={
                    key
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400"
                />
              ),
            )}

            <button
              onClick={
                createShipment
              }
              className="gogate-button w-full rounded-2xl py-3 font-black"
            >
              Create Shipment
            </button>

          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700">
              {error}
            </div>
          )}

        </SectionCard>

        <SectionCard title="Backend Response">

          {result ? (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs">
              {
                JSON.stringify(
                  result,
                  null,
                  2,
                )
              }
            </pre>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
              Shipment API response will appear here.
            </div>
          )}

        </SectionCard>

      </div>

    </PortalShell>
  );
}