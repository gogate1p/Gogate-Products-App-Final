"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BackendApi,
} from "@/lib/backend-api";

import {
  ApiState,
  PortalShell,
  SectionCard,
} from "@/components/portal/PortalShell";

export default function Page() {
  const [
    records,
    setRecords,
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
      const response:
        any =
        await BackendApi
          .riderPendingKyc();

      setRecords(
        Array.isArray(
          response,
        )
          ? response
          : response?.data ??
            [],
      );

      setError(null);
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Unable to load verification queue. An admin JWT may be required.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function approve(
    riderId:
      string,
  ) {
    try {
      await BackendApi
        .approveRiderKyc(
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
    riderId:
      string,
  ) {
    const reason =
      window.prompt(
        "Rejection reason",
      );

    if (!reason) {
      return;
    }

    try {
      await BackendApi
        .rejectRiderKyc(
          riderId,
          {
            reason,
          },
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
    <PortalShell
      title="Verification Center"
      subtitle="Admin review and approval operations."
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

      <ApiState
        loading={
          loading
        }
        error={
          error
        }
      />

      <SectionCard
        title="Rider KYC Queue"
        subtitle="Connected to /workforce/hub/kyc/pending"
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px] text-left text-sm">

            <thead>

              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">

                <th className="px-3 py-3">
                  Rider
                </th>

                <th className="px-3 py-3">
                  Status
                </th>

                <th className="px-3 py-3">
                  Submitted
                </th>

                <th className="px-3 py-3 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {records.length === 0 && (
                <tr>

                  <td
                    colSpan={4}
                    className="px-3 py-10 text-center text-slate-400"
                  >
                    No pending records returned.
                  </td>

                </tr>
              )}

              {records.map(
                (
                  record:
                    any,
                ) => {
                  const riderId =
                    record.riderProfileId ??
                    record.riderId ??
                    record.id;

                  return (
                    <tr
                      key={
                        record.id ??
                        riderId
                      }
                      className="border-b border-slate-100"
                    >

                      <td className="px-3 py-4">

                        <div className="font-black">
                          {
                            record.riderProfile?.riderCode ??
                            record.user?.phone ??
                            riderId
                          }
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          {
                            riderId
                          }
                        </div>

                      </td>

                      <td className="px-3 py-4">

                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
                          {
                            record.status ??
                            "PENDING"
                          }
                        </span>

                      </td>

                      <td className="px-3 py-4 text-slate-500">
                        {
                          record.submittedAt
                            ? new Date(
                                record.submittedAt,
                              ).toLocaleString()
                            : "—"
                        }
                      </td>

                      <td className="px-3 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={
                              () =>
                                approve(
                                  riderId,
                                )
                            }
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-white"
                          >
                            Approve
                          </button>

                          <button
                            onClick={
                              () =>
                                reject(
                                  riderId,
                                )
                            }
                            className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600"
                          >
                            Reject
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                },
              )}

            </tbody>

          </table>

        </div>

      </SectionCard>

    </PortalShell>
  );
}