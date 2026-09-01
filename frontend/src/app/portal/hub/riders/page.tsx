"use client";

import {
  useEffect,
  useState,
} from "react";

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
    phone,
    setPhone,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    credentials,
    setCredentials,
  ] =
    useState<any>(
      null,
    );

  async function load() {
    const response =
      await HubApi.riders();

    setRows(
      Array.isArray(response)
        ? response
        : [],
    );
  }

  useEffect(
    () => {
      load();
    },
    [],
  );

  async function create() {
    const result =
      await HubApi.createRider({
        phone,
        email:
          email || undefined,
      });

    setCredentials(
      result.credentials,
    );

    setPhone("");
    setEmail("");

    await load();
  }

  return (
    <div>

      <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
        Gogate Products
      </div>

      <h1 className="mt-2 text-3xl font-black">
        Hub Riders
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Add and manage delivery executives assigned to this hub.
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.7fr_1.3fr]">

        <section className="rounded-3xl border border-slate-200 bg-white p-6">

          <h2 className="text-lg font-black">
            Add Rider
          </h2>

          <input
            value={phone}
            onChange={
              event =>
                setPhone(
                  event.target.value,
                )
            }
            placeholder="Mobile number"
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none"
          />

          <input
            value={email}
            onChange={
              event =>
                setEmail(
                  event.target.value,
                )
            }
            placeholder="Email (optional)"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none"
          />

          <button
            onClick={create}
            className="mt-4 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white"
          >
            Create Rider
          </button>

          {credentials && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

              <div className="font-black text-emerald-700">
                Rider Created
              </div>

              <div className="mt-4 text-sm">
                User ID:
                <strong className="ml-2">
                  {credentials.userId}
                </strong>
              </div>

              <div className="mt-2 text-sm">
                Rider ID:
                <strong className="ml-2">
                  {credentials.riderId}
                </strong>
              </div>

              <div className="mt-2 text-sm">
                Temporary Password:
                <strong className="ml-2">
                  {credentials.password}
                </strong>
              </div>

              <div className="mt-4 text-xs font-bold text-emerald-700">
                Save this password now. It should only be shown once.
              </div>

            </div>
          )}

        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

          <div className="border-b border-slate-200 p-5 font-black">
            Assigned Riders ({rows.length})
          </div>

          <div className="divide-y divide-slate-100">

            {rows.map(
              row => (
                <div
                  key={row.id}
                  className="p-5"
                >

                  <div className="font-black">
                    {
                      row.riderProfile?.riderCode ??
                      "Rider"
                    }
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {
                      row.riderProfile?.user?.phone
                    }
                  </div>

                  <div className="mt-1 text-xs font-bold text-emerald-600">
                    {
                      row.assignmentStatus
                    }
                  </div>

                </div>
              ),
            )}

          </div>

        </section>

      </div>

    </div>
  );
}