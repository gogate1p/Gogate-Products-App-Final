"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  MapPinned,
  Search,
  ShieldCheck,
  UserCog,
  XCircle,
} from "lucide-react";

import {
  Assignment,
  AssignmentApi,
} from "@/lib/assignment-api";

export default function Page() {
  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [users, setUsers] =
    useState<any[]>([]);

  const [hubs, setHubs] =
    useState<any[]>([]);

  const [branches, setBranches] =
    useState<any[]>([]);

  const [regions, setRegions] =
    useState<string[]>([]);

  const [search, setSearch] =
    useState("");

  const [userId, setUserId] =
    useState("");

  const [scopeType, setScopeType] =
    useState("BRANCH");

  const [scopeId, setScopeId] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [isPrimary, setIsPrimary] =
    useState(true);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [
        assignmentRows,
        scopeData,
      ] =
        await Promise.all([
          AssignmentApi.list(),
          AssignmentApi.scopes(),
        ]);

      setAssignments(
        Array.isArray(
          assignmentRows,
        )
          ? assignmentRows
          : [],
      );

      setUsers(
        scopeData?.users ?? [],
      );

      setHubs(
        scopeData?.hubs ?? [],
      );

      setBranches(
        scopeData?.branches ?? [],
      );

      setRegions(
        scopeData?.regions ?? [],
      );
    } catch (
      err: any
    ) {
      setError(
        err?.message ??
        "Unable to load assignments.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered =
    useMemo(
      () => {
        const q =
          search
            .trim()
            .toLowerCase();

        if (!q) {
          return assignments;
        }

        return assignments.filter(
          row =>
            row.scopeType
              ?.toLowerCase()
              .includes(q) ||
            row.scopeName
              ?.toLowerCase()
              .includes(q) ||
            row.scopeCode
              ?.toLowerCase()
              .includes(q) ||
            row.region
              ?.toLowerCase()
              .includes(q) ||
            row.userId
              ?.toLowerCase()
              .includes(q),
        );
      },
      [
        assignments,
        search,
      ],
    );

  const scopeOptions =
    scopeType === "HUB"
      ? hubs
      : scopeType === "BRANCH"
        ? branches
        : [];

  async function create() {
    setError("");

    if (!userId) {
      setError(
        "Select a user.",
      );
      return;
    }

    if (
      scopeType !==
        "REGION" &&
      !scopeId
    ) {
      setError(
        "Select a scope.",
      );
      return;
    }

    if (
      scopeType ===
        "REGION" &&
      !region
    ) {
      setError(
        "Select a region.",
      );
      return;
    }

    const selectedScope =
      scopeOptions.find(
        x =>
          x.id ===
          scopeId,
      );

    try {
      await AssignmentApi.create({
        userId,
        scopeType,
        scopeId:
          scopeType ===
          "REGION"
            ? undefined
            : scopeId,

        scopeCode:
          selectedScope?.hubCode ??
          selectedScope?.branchCode,

        scopeName:
          selectedScope?.name,

        region:
          scopeType ===
          "REGION"
            ? region
            : selectedScope?.region,

        isPrimary,
      });

      setScopeId("");
      setRegion("");

      await load();
    } catch (
      err: any
    ) {
      setError(
        err?.message ??
        "Assignment creation failed.",
      );
    }
  }

  async function deactivate(
    id: string,
  ) {
    if (
      !window.confirm(
        "Remove this assignment?",
      )
    ) {
      return;
    }

    try {
      await AssignmentApi.deactivate(
        id,
      );

      await load();
    } catch (
      err: any
    ) {
      setError(
        err?.message ??
        "Unable to remove assignment.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-[1500px]">

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

        <div>

          <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
            Gogate Products Administration
          </div>

          <h1 className="mt-2 text-3xl font-black">
            User Assignments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Control the operational hub, branch and regional scope available to each user.
          </p>

        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">

          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            value={search}
            onChange={
              e =>
                setSearch(
                  e.target.value,
                )
            }
            placeholder="Search assignments..."
            className="min-w-[240px] bg-transparent text-sm outline-none"
          />

        </div>

      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 grid gap-6 xl:grid-cols-[400px_1fr]">

        <section className="rounded-[28px] border border-slate-200 bg-white p-6">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
              <UserCog size={20} />
            </div>

            <div>

              <div className="font-black">
                New Assignment
              </div>

              <div className="text-xs text-slate-400">
                Set user's operating scope
              </div>

            </div>

          </div>

          <label className="mt-6 block text-xs font-black text-slate-600">
            User
          </label>

          <select
            value={userId}
            onChange={
              e =>
                setUserId(
                  e.target.value,
                )
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold"
          >
            <option value="">
              Select user
            </option>

            {users.map(
              user => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {
                    user.userCode ??
                    user.phone
                  }
                  {" · "}
                  {
                    user.role
                  }
                </option>
              ),
            )}
          </select>

          <label className="mt-4 block text-xs font-black text-slate-600">
            Assignment Type
          </label>

          <select
            value={scopeType}
            onChange={
              e => {
                setScopeType(
                  e.target.value,
                );

                setScopeId("");
                setRegion("");
              }
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold"
          >
            <option value="BRANCH">
              Courier Branch
            </option>

            <option value="HUB">
              Hub
            </option>

            <option value="REGION">
              Region
            </option>
          </select>

          {scopeType ===
            "REGION" ? (
            <>
              <label className="mt-4 block text-xs font-black text-slate-600">
                Region
              </label>

              <select
                value={region}
                onChange={
                  e =>
                    setRegion(
                      e.target.value,
                    )
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold"
              >
                <option value="">
                  Select region
                </option>

                {regions.map(
                  item => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ),
                )}
              </select>
            </>
          ) : (
            <>
              <label className="mt-4 block text-xs font-black text-slate-600">
                {
                  scopeType ===
                  "HUB"
                    ? "Hub"
                    : "Courier Branch"
                }
              </label>

              <select
                value={scopeId}
                onChange={
                  e =>
                    setScopeId(
                      e.target.value,
                    )
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold"
              >
                <option value="">
                  Select
                </option>

                {scopeOptions.map(
                  item => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                      {" · "}
                      {
                        item.hubCode ??
                        item.branchCode ??
                        ""
                      }
                    </option>
                  ),
                )}
              </select>
            </>
          )}

          <label className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

            <input
              type="checkbox"
              checked={isPrimary}
              onChange={
                e =>
                  setIsPrimary(
                    e.target.checked,
                  )
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-black text-slate-700">
              Primary assignment
            </span>

          </label>

          <button
            onClick={create}
            className="mt-5 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white"
          >
            Save Assignment
          </button>

        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-100 p-5">

            <div>

              <div className="font-black">
                Active Assignments
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {filtered.length} records
              </div>

            </div>

            <ShieldCheck
              className="text-[#0284c7]"
              size={22}
            />

          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              Loading assignments...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No assignments available.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filtered.map(
                row => (
                  <div
                    key={row.id}
                    className="grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto]"
                  >

                    <div>

                      <div className="text-xs font-bold text-slate-400">
                        USER
                      </div>

                      <div className="mt-1 font-black">
                        {row.userId}
                      </div>

                      {row.isPrimary && (
                        <div className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
                          PRIMARY
                        </div>
                      )}

                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        {
                          row.scopeType ===
                          "REGION"
                            ? (
                              <MapPinned
                                size={16}
                                className="text-[#0284c7]"
                              />
                            )
                            : (
                              <Building2
                                size={16}
                                className="text-[#0284c7]"
                              />
                            )
                        }

                        <span className="font-black">
                          {
                            row.scopeName ??
                            row.region ??
                            row.scopeType
                          }
                        </span>

                      </div>

                      <div className="mt-1 text-xs font-bold text-slate-400">
                        {
                          row.scopeCode ??
                          row.scopeType
                        }
                      </div>

                    </div>

                    <div>

                      {row.status ===
                        "ACTIVE" && (
                        <button
                          onClick={
                            () =>
                              deactivate(
                                row.id,
                              )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                        >
                          <XCircle size={14} />
                          Remove
                        </button>
                      )}

                    </div>

                  </div>
                ),
              )}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}