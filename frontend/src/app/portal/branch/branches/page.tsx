"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BranchApi,
} from "@/lib/branch-api";

export default function Page() {
  const [branches, setBranches] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [city, setCity] =
    useState("");

  const [pinCode, setPinCode] =
    useState("");

  async function load() {
    const response =
      await BranchApi.branches();

    setBranches(
      Array.isArray(response)
        ? response
        : [],
    );
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    await BranchApi.createBranch({
      name,
      city,
      pinCode,
    });

    setName("");
    setCity("");
    setPinCode("");

    await load();
  }

  return (
    <div>

      <h1 className="text-3xl font-black">
        Courier Branches
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Admin and operations branch registry.
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.7fr_1.3fr]">

        <div className="rounded-3xl border border-slate-200 bg-white p-6">

          <h2 className="font-black">
            Create Branch
          </h2>

          <input
            value={name}
            onChange={
              e =>
                setName(
                  e.target.value,
                )
            }
            placeholder="Branch name"
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <input
            value={city}
            onChange={
              e =>
                setCity(
                  e.target.value,
                )
            }
            placeholder="City"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <input
            value={pinCode}
            onChange={
              e =>
                setPinCode(
                  e.target.value,
                )
            }
            placeholder="PIN Code"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <button
            onClick={create}
            className="mt-4 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white"
          >
            Create Courier Branch
          </button>

        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

          {branches.map(
            branch => (
              <div
                key={branch.id}
                className="border-b border-slate-100 p-5"
              >

                <div className="font-black">
                  {branch.name}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Branch ID:
                  {" "}
                  {branch.branchCode}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  {
                    branch.city ??
                    ""
                  }
                  {" "}
                  {
                    branch.pinCode ??
                    ""
                  }
                </div>

              </div>
            ),
          )}

        </div>

      </div>

    </div>
  );
}