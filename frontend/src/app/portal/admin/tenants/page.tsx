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
    tenants,
    setTenants,
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

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    domain,
    setDomain,
  ] =
    useState("");

  async function load() {
    setLoading(true);

    try {
      const response:
        any =
        await BackendApi
          .tenants();

      setTenants(
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
        "Unable to load tenants",
      );
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    if (!name.trim()) {
      return;
    }

    try {
      await BackendApi
        .createTenant({
          name:
            name.trim(),

          domain:
            domain.trim() ||
            undefined,
        });

      setName("");
      setDomain("");

      await load();
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Tenant creation failed",
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
      title="Tenant Management"
      subtitle="Manage Gogate Products tenant organizations."
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

      <div className="mt-5 grid gap-6 xl:grid-cols-[.65fr_1.35fr]">

        <SectionCard title="Create Tenant">

          <div className="space-y-3">

            <input
              value={
                name
              }
              onChange={
                (
                  event,
                ) =>
                  setName(
                    event.target.value,
                  )
              }
              placeholder="Tenant name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400"
            />

            <input
              value={
                domain
              }
              onChange={
                (
                  event,
                ) =>
                  setDomain(
                    event.target.value,
                  )
              }
              placeholder="Domain (optional)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400"
            />

            <button
              onClick={
                create
              }
              className="gogate-button w-full rounded-2xl py-3 font-black"
            >
              Create Tenant
            </button>

          </div>

        </SectionCard>

        <SectionCard
          title="Existing Tenants"
          subtitle="Loaded directly from NestJS"
        >

          <div className="overflow-x-auto">

            <table className="w-full min-w-[600px] text-left text-sm">

              <thead>

                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-3">
                    Name
                  </th>
                  <th className="px-3 py-3">
                    Domain
                  </th>
                  <th className="px-3 py-3">
                    ID
                  </th>
                </tr>

              </thead>

              <tbody>

                {tenants.map(
                  (
                    tenant:
                      any,
                  ) => (
                    <tr
                      key={
                        tenant.id
                      }
                      className="border-b border-slate-100"
                    >

                      <td className="px-3 py-4 font-black">
                        {
                          tenant.name ??
                          "Tenant"
                        }
                      </td>

                      <td className="px-3 py-4 text-slate-500">
                        {
                          tenant.domain ??
                          "—"
                        }
                      </td>

                      <td className="px-3 py-4 font-mono text-xs text-slate-400">
                        {
                          tenant.id
                        }
                      </td>

                    </tr>
                  ),
                )}

              </tbody>

            </table>

          </div>

        </SectionCard>

      </div>

    </PortalShell>
  );
}