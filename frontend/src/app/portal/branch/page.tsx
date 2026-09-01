"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  PackageSearch,
  Truck,
  UsersRound,
} from "lucide-react";

import {
  BranchApi,
  selectBranch,
} from "@/lib/branch-api";

export default function Page() {
  const [data, setData] =
    useState<any>(null);

  const [branches, setBranches] =
    useState<any[]>([]);

  async function load() {
    const list:
      any[] =
      await BranchApi.branches();

    setBranches(list);

    if (
      list.length &&
      !localStorage.getItem(
        "gogate_branch_id",
      )
    ) {
      selectBranch(
        list[0].id,
      );
    }

    if (list.length) {
      const result =
        await BranchApi.dashboard();

      setData(result);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const m =
    data?.metrics ?? {};

  return (
    <div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="text-sm font-black text-[#0284c7]">
            Courier Branch Control Center
          </div>

          <h1 className="mt-1 text-3xl font-black">
            {
              data?.branch?.name ??
              "Branch Dashboard"
            }
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Customer bookings, pickups and courier operations.
          </p>

        </div>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black"
          onChange={
            e => {
              selectBranch(
                e.target.value,
              );

              window.location.reload();
            }
          }
        >

          {branches.map(
            branch => (
              <option
                key={branch.id}
                value={branch.id}
              >
                {
                  branch.name
                }
                {" · "}
                {
                  branch.branchCode
                }
              </option>
            ),
          )}

        </select>

      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Metric
          icon={Truck}
          title="Pickup Requests"
          value={m.pickups ?? 0}
        />

        <Metric
          icon={PackageSearch}
          title="Shipments"
          value={m.shipments ?? 0}
        />

        <Metric
          icon={CheckCircle2}
          title="Delivered"
          value={m.delivered ?? 0}
        />

        <Metric
          icon={UsersRound}
          title="Branch Staff"
          value={m.branchUsers ?? 0}
        />

      </div>

      {data?.branch && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">

          <div className="font-black">
            Branch Information
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">

            <Info
              label="Branch ID"
              value={
                data.branch.branchCode
              }
            />

            <Info
              label="City"
              value={
                data.branch.city ??
                "—"
              }
            />

            <Info
              label="PIN Code"
              value={
                data.branch.pinCode ??
                "—"
              }
            />

          </div>

        </div>
      )}

    </div>
  );
}

function Metric({
  icon: Icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">

      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
        <Icon size={21} />
      </div>

      <div className="mt-5 text-3xl font-black">
        {value}
      </div>

      <div className="mt-1 text-sm font-black text-slate-600">
        {title}
      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: any) {
  return (
    <div>

      <div className="text-xs font-bold text-slate-400">
        {label}
      </div>

      <div className="mt-1 font-black">
        {value}
      </div>

    </div>
  );
}