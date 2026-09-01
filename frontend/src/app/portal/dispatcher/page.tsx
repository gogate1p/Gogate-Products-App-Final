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
    awb,
    setAwb,
  ] =
    useState("");

  const [
    shipmentId,
    setShipmentId,
  ] =
    useState("");

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

  async function track() {
    try {
      setError(null);

      setResponse(
        await BackendApi
          .trackShipment(
            awb,
          ),
      );
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Tracking failed",
      );
    }
  }

  async function markOfd() {
    try {
      setError(null);

      setResponse(
        await BackendApi
          .outForDelivery(
            shipmentId,
          ),
      );
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Status update failed",
      );
    }
  }

  return (
    <PortalShell
      title="Dispatcher Control"
      subtitle="Shipment status and dispatch operations."
      badge="Dispatcher"

      nav={[
        {
          href:
            "/portal/dispatcher",
          label:
            "Dispatch Board",
          icon:
            "dispatch",
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
            "/portal/support",
          label:
            "Escalations",
          icon:
            "support",
        },
      ]}
    >

      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard
          label="Tracking"
          value="Live"
          hint="GET shipment events"
          color="green"
        />

        <StatCard
          label="OFD"
          value="Enabled"
          hint="PATCH out-for-delivery"
        />

        <StatCard
          label="Routes"
          value="Pending API"
          hint="No route listing endpoint exposed"
          color="orange"
        />

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        <SectionCard title="Track AWB">

          <input
            value={
              awb
            }
            onChange={
              (
                event,
              ) =>
                setAwb(
                  event.target.value,
                )
            }
            placeholder="AWB"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
          />

          <button
            onClick={
              track
            }
            className="gogate-button mt-3 w-full rounded-2xl py-3 font-black"
          >
            Track Shipment
          </button>

        </SectionCard>

        <SectionCard title="Mark Out For Delivery">

          <input
            value={
              shipmentId
            }
            onChange={
              (
                event,
              ) =>
                setShipmentId(
                  event.target.value,
                )
            }
            placeholder="Shipment ID"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
          />

          <button
            onClick={
              markOfd
            }
            className="gogate-button mt-3 w-full rounded-2xl py-3 font-black"
          >
            Mark Out For Delivery
          </button>

        </SectionCard>

      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-orange-50 p-4 font-bold text-orange-700">
          {error}
        </div>
      )}

      {response && (
        <pre className="gogate-card mt-6 max-h-[500px] overflow-auto whitespace-pre-wrap p-5 text-xs">
          {
            JSON.stringify(
              response,
              null,
              2,
            )
          }
        </pre>
      )}

    </PortalShell>
  );
}