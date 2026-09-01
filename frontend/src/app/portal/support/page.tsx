"use client";

import {
  FormEvent,
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
    tracking,
    setTracking,
  ] =
    useState<any>(
      null,
    );

  const [
    input,
    setInput,
  ] =
    useState("");

  const [
    messages,
    setMessages,
  ] =
    useState([
      {
        sender:
          "system",

        text:
          "Welcome to Gogate Products Customer Care.",
      },
    ]);

  async function findShipment() {
    if (!awb) {
      return;
    }

    try {
      setTracking(
        await BackendApi
          .trackShipment(
            awb,
          ),
      );
    } catch (
      err:
        any
    ) {
      setTracking({
        error:
          err?.message ??
          "Shipment not found",
      });
    }
  }

  function send(
    event:
      FormEvent,
  ) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    setMessages(
      (
        old,
      ) => [
        ...old,

        {
          sender:
            "agent",

          text:
            input.trim(),
        },
      ],
    );

    setInput("");
  }

  return (
    <PortalShell
      title="Customer Care"
      subtitle="Customer support with shipment context."
      badge="Support"

      nav={[
        {
          href:
            "/portal/support",
          label:
            "Support Desk",
          icon:
            "support",
        },
        {
          href:
            "/portal/customer",
          label:
            "Customer View",
          icon:
            "dashboard",
        },
      ]}
    >

      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard
          label="Tracking"
          value="Connected"
          hint="Backend shipment lookup"
          color="green"
        />

        <StatCard
          label="Chat"
          value="UI Ready"
          hint="Persistence backend pending"
        />

        <StatCard
          label="Escalation"
          value="Ops"
          hint="Operational support"
          color="teal"
        />

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.65fr_1.35fr]">

        <SectionCard title="Shipment Context">

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
            placeholder="Customer AWB"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
          />

          <button
            onClick={
              findShipment
            }
            className="gogate-button mt-3 w-full rounded-2xl py-3 font-black"
          >
            Load Shipment
          </button>

          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs">
            {
              tracking
                ? JSON.stringify(
                    tracking,
                    null,
                    2,
                  )
                : "No shipment loaded"
            }
          </pre>

        </SectionCard>

        <SectionCard title="Live Chat Workspace">

          <div className="min-h-80 space-y-3 rounded-2xl bg-slate-50 p-4">

            {messages.map(
              (
                message,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className={`flex ${
                    message.sender ===
                    "agent"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-semibold ${
                      message.sender ===
                      "agent"
                        ? "bg-[#0284c7] text-white"
                        : "border border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {
                      message.text
                    }
                  </div>

                </div>
              ),
            )}

          </div>

          <form
            onSubmit={
              send
            }
            className="mt-3 flex gap-2"
          >

            <input
              value={
                input
              }
              onChange={
                (
                  event,
                ) =>
                  setInput(
                    event.target.value,
                  )
              }
              placeholder="Type reply..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            />

            <button className="rounded-2xl bg-[#0284c7] px-6 font-black text-white">
              Send
            </button>

          </form>

        </SectionCard>

      </div>

    </PortalShell>
  );
}