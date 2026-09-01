"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  HubApi,
} from "@/lib/hub-api";

export default function Page() {
  const [
    rows,
    setRows,
  ] =
    useState<any[]>([]);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response:
        any =
        await HubApi.pendingKyc();

      setRows(
        Array.isArray(
          response,
        )
          ? response
          : response?.data ??
            [],
      );
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Unable to load KYC queue.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function approve(
    riderId: string,
  ) {
    try {
      await HubApi.approveKyc(
        riderId,
      );

      await load();
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Approval failed",
      );
    }
  }

  async function reject(
    riderId: string,
  ) {
    const reason =
      window.prompt(
        "Enter rejection reason:",
      );

    if (!reason) {
      return;
    }

    try {
      await HubApi.rejectKyc(
        riderId,
        reason,
      );

      await load();
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Rejection failed",
      );
    }
  }

  useEffect(
    () => {
      load();
    },
    [],
  );

  return (
    <div>

      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>

          <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
            Gogate Products
          </div>

          <h1 className="mt-2 text-3xl font-black">
            Rider Verification
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Hub verification queue for Delivery Executive onboarding.
          </p>

        </div>

        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>

      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            Loading verification queue...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-500">
              <ShieldCheck size={27} />
            </div>

            <div className="mt-4 font-black">
              Verification queue clear
            </div>

            <div className="mt-1 text-sm text-slate-400">
              No rider KYC applications require action.
            </div>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {rows.map(
              (
                row,
                index,
              ) => {
                const riderId =
                  row.riderProfileId ??
                  row.riderId ??
                  row.riderProfile?.id ??
                  row.id;

                return (
                  <div
                    key={
                      row.id ??
                      index
                    }
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <div className="font-black">
                        {
                          row.riderProfile?.riderCode ??
                          row.user?.phone ??
                          riderId
                        }
                      </div>

                      <div className="mt-1 text-xs font-black text-orange-600">
                        {
                          row.status ??
                          "PENDING"
                        }
                      </div>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={
                          () =>
                            approve(
                              riderId,
                            )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-white"
                      >
                        <CheckCircle2 size={15} />
                        Approve
                      </button>

                      <button
                        onClick={
                          () =>
                            reject(
                              riderId,
                            )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600"
                      >
                        <XCircle size={15} />
                        Reject
                      </button>

                    </div>

                  </div>
                );
              },
            )}

          </div>
        )}

      </div>

    </div>
  );
}