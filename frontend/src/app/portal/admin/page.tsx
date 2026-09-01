"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Database,
  PackageSearch,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import {
  BackendApi,
} from "@/lib/backend-api";

import {
  ApiState,
  PortalShell,
  SectionCard,
  StatCard,
} from "@/components/portal/PortalShell";

export default function AdminPage() {
  const [
    tenants,
    setTenants,
  ] =
    useState<any[]>([]);

  const [
    pendingKyc,
    setPendingKyc,
  ] =
    useState<any[]>([]);

  const [
    backendOk,
    setBackendOk,
  ] =
    useState(false);

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
    setError(null);

    try {
      const health =
        await BackendApi
          .health();

      setBackendOk(
        Boolean(
          health,
        ),
      );

      try {
        const tenantData:
          any =
          await BackendApi
            .tenants();

        setTenants(
          Array.isArray(
            tenantData,
          )
            ? tenantData
            : tenantData?.data ??
              [],
        );
      } catch {
        setTenants([]);
      }

      try {
        const kycData:
          any =
          await BackendApi
            .riderPendingKyc();

        setPendingKyc(
          Array.isArray(
            kycData,
          )
            ? kycData
            : kycData?.data ??
              [],
        );
      } catch {
        setPendingKyc([]);
      }
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Backend unavailable",
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

  return (
    <PortalShell
      title="Admin Control Center"
      subtitle="Network-wide operations, verification, tenants, settings and governance."
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
        {
          href:
            "/portal/hub",
          label:
            "Hub Operations",
          icon:
            "hub",
        },
        {
          href:
            "/portal/dispatcher",
          label:
            "Dispatcher",
          icon:
            "dispatch",
        },
        {
          href:
            "/portal/wms",
          label:
            "WMS",
          icon:
            "wms",
        },
        {
          href:
            "/portal/support",
          label:
            "Customer Care",
          icon:
            "support",
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Backend"
          value={
            backendOk
              ? "Online"
              : "Offline"
          }
          hint="NestJS API status"
          color={
            backendOk
              ? "green"
              : "orange"
          }
        />

        <StatCard
          label="Tenants"
          value={
            String(
              tenants.length,
            )
          }
          hint="Loaded from backend"
        />

        <StatCard
          label="Pending KYC"
          value={
            String(
              pendingKyc.length,
            )
          }
          hint="Rider KYC review queue"
          color="orange"
        />

        <StatCard
          label="Platform"
          value="Active"
          hint="Gogate Products operations"
          color="teal"
        />

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">

        <SectionCard
          title="System Overview"
          subtitle="Connected backend services"
        >

          <div className="grid gap-3 sm:grid-cols-2">

            {[
              [
                Database,
                "Database",
                "Neon PostgreSQL / Prisma",
                "Connected through backend",
              ],
              [
                Building2,
                "Tenants",
                `${tenants.length} loaded`,
                "Multi-tenant platform",
              ],
              [
                UsersRound,
                "Verification",
                `${pendingKyc.length} pending`,
                "Admin approval queue",
              ],
              [
                PackageSearch,
                "Shipments",
                "Tracking enabled",
                "AWB event lookup",
              ],
            ].map(
              (
                [
                  Icon,
                  title,
                  value,
                  caption,
                ]:
                  any,
              ) => (
                <div
                  key={
                    title
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >

                  <Icon
                    size={20}
                    className="text-[#0284c7]"
                  />

                  <div className="mt-4 font-black">
                    {title}
                  </div>

                  <div className="mt-2 text-sm font-black text-slate-700">
                    {value}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {caption}
                  </div>

                </div>
              ),
            )}

          </div>

        </SectionCard>

        <SectionCard title="Admin Actions">

          <div className="space-y-3">

            <a
              href="/portal/admin/verifications"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-black transition hover:border-sky-200 hover:bg-sky-50"
            >
              <ShieldCheck
                size={19}
                className="text-[#0284c7]"
              />

              Verification Center
            </a>

            <a
              href="/portal/admin/tenants"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-black transition hover:border-sky-200 hover:bg-sky-50"
            >
              <Building2
                size={19}
                className="text-[#0284c7]"
              />

              Manage Tenants
            </a>

            <a
              href="/portal/admin/settings"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-black transition hover:border-sky-200 hover:bg-sky-50"
            >
              <CheckCircle2
                size={19}
                className="text-emerald-500"
              />

              Portal Settings
            </a>

            <button
              onClick={
                load
              }
              className="gogate-button w-full rounded-2xl p-4 font-black"
            >
              Refresh Backend
            </button>

          </div>

        </SectionCard>

      </div>

    </PortalShell>
  );
}