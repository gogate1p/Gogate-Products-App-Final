"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeCheck,
  KeyRound,
  Search,
  ShieldCheck,
  UserPlus,
  UserRoundX,
  UsersRound,
} from "lucide-react";

import {
  AdminUser,
  AdminUsersApi,
} from "@/lib/admin-users-api";

const roles = [
  "SUPER_ADMIN",
  "ADMIN",
  "OPERATIONS_MANAGER",
  "REGIONAL_MANAGER",
  "HUB_MANAGER",
  "HUB_PERSONNEL",
  "DISPATCHER",
  "BRANCH_MANAGER",
  "BRANCH_STAFF",
  "BOOKING_AGENT",
  "FLEET_MANAGER",
  "FINANCE",
  "SUPPORT",
  "MERCHANT",
  "SHIPPER",
  "CUSTOMER",
];

export default function Page() {
  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("BRANCH_STAFF");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [credentials, setCredentials] =
    useState<{
      userId?: string;
      temporaryPassword?: string;
    } | null>(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const result =
        await AdminUsersApi.list();

      setUsers(
        Array.isArray(result)
          ? result
          : [],
      );
    } catch (err: any) {
      setError(
        err?.message ??
        "Unable to load users.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      if (!q) {
        return users;
      }

      return users.filter(
        user =>
          String(
            user.userCode ??
            user.userId ??
            "",
          )
            .toLowerCase()
            .includes(q) ||
          user.phone
            ?.toLowerCase()
            .includes(q) ||
          user.email
            ?.toLowerCase()
            .includes(q) ||
          user.role
            ?.toLowerCase()
            .includes(q) ||
          user.status
            ?.toLowerCase()
            .includes(q),
      );
    }, [
      users,
      search,
    ]);

  async function create() {
    setError("");
    setCredentials(null);

    try {
      const result: any =
        await AdminUsersApi.create({
          phone,
          email:
            email || undefined,
          role,
        });

      setCredentials(
        result.credentials ?? null,
      );

      setPhone("");
      setEmail("");

      await load();
    } catch (err: any) {
      setError(
        err?.message ??
        "Unable to create user.",
      );
    }
  }

  async function resetPassword(
    id: string,
  ) {
    setError("");

    try {
      const result: any =
        await AdminUsersApi.resetPassword(
          id,
        );

      window.alert(
        `Temporary password: ${
          result.temporaryPassword ??
          "Generated"
        }`,
      );

      await load();
    } catch (err: any) {
      setError(
        err?.message ??
        "Unable to reset password.",
      );
    }
  }

  async function deactivate(
    id: string,
  ) {
    if (
      !window.confirm(
        "Deactivate this account?",
      )
    ) {
      return;
    }

    setError("");

    try {
      await AdminUsersApi.deactivate(
        id,
      );

      await load();
    } catch (err: any) {
      setError(
        err?.message ??
        "Unable to deactivate user.",
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

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Users & Access
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create and manage operations, hub, branch, dispatcher, support, merchant and shipper accounts.
          </p>

        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

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
            placeholder="Search users..."
            className="w-full min-w-[230px] bg-transparent text-sm outline-none"
          />

        </div>

      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 grid gap-6 xl:grid-cols-[380px_1fr]">

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,.04)]">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
              <UserPlus size={20} />
            </div>

            <div>

              <div className="font-black">
                Create User
              </div>

              <div className="text-xs text-slate-400">
                Auto-generates User ID and password
              </div>

            </div>

          </div>

          <label className="mt-6 block text-xs font-black text-slate-600">
            Mobile Number
          </label>

          <input
            value={phone}
            onChange={
              e =>
                setPhone(
                  e.target.value,
                )
            }
            placeholder="Registered mobile"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400"
          />

          <label className="mt-4 block text-xs font-black text-slate-600">
            Email
          </label>

          <input
            value={email}
            onChange={
              e =>
                setEmail(
                  e.target.value,
                )
            }
            placeholder="Optional email"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400"
          />

          <label className="mt-4 block text-xs font-black text-slate-600">
            Role
          </label>

          <select
            value={role}
            onChange={
              e =>
                setRole(
                  e.target.value,
                )
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none focus:border-sky-400"
          >

            {roles.map(
              role => (
                <option
                  key={role}
                  value={role}
                >
                  {
                    role.replaceAll(
                      "_",
                      " ",
                    )
                  }
                </option>
              ),
            )}

          </select>

          <button
            onClick={create}
            disabled={!phone.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0284c7] py-4 font-black text-white shadow-[0_12px_30px_rgba(2,132,199,.18)] disabled:opacity-50"
          >
            <UserPlus size={17} />
            Create Account
          </button>

          {credentials && (
            <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">

              <div className="flex items-center gap-2 font-black text-emerald-700">
                <BadgeCheck size={18} />
                Account Created
              </div>

              <div className="mt-4 text-xs font-bold text-emerald-700">
                USER ID
              </div>

              <div className="mt-1 text-2xl font-black tracking-wider text-slate-900">
                {credentials.userId}
              </div>

              <div className="mt-4 text-xs font-bold text-emerald-700">
                TEMPORARY PASSWORD
              </div>

              <div className="mt-1 font-black text-slate-900">
                {
                  credentials.temporaryPassword
                }
              </div>

              <div className="mt-4 text-xs leading-5 text-slate-600">
                The user will be required to change this password after first login.
              </div>

            </div>
          )}

        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,.04)]">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-[#0284c7]">
                <UsersRound size={19} />
              </div>

              <div>

                <div className="font-black">
                  User Directory
                </div>

                <div className="text-xs text-slate-400">
                  {filtered.length} accounts
                </div>

              </div>

            </div>

          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-bold text-slate-400">
              Loading users...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">
              No users found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filtered.map(
                user => (
                  <div
                    key={user.id}
                    className="grid gap-4 p-5 transition hover:bg-slate-50 sm:px-6 lg:grid-cols-[1.1fr_1fr_auto]"
                  >

                    <div>

                      <div className="text-lg font-black tracking-wide">
                        {
                          user.userCode ??
                          user.userId ??
                          "—"
                        }
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {user.phone}
                      </div>

                      {user.email && (
                        <div className="mt-1 text-xs text-slate-400">
                          {user.email}
                        </div>
                      )}

                    </div>

                    <div>

                      <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black text-[#0284c7]">
                        {
                          user.role.replaceAll(
                            "_",
                            " ",
                          )
                        }
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs">

                        <ShieldCheck
                          size={14}
                          className="text-emerald-500"
                        />

                        <span className="font-bold text-slate-500">
                          {user.status}
                        </span>

                      </div>

                      {user.mustChangePassword && (
                        <div className="mt-1 text-[10px] font-black text-orange-500">
                          PASSWORD CHANGE REQUIRED
                        </div>
                      )}

                      {user.lastLoginAt && (
                        <div className="mt-2 text-[10px] text-slate-400">
                          Last login:
                          {" "}
                          {
                            new Date(
                              user.lastLoginAt,
                            ).toLocaleString()
                          }
                        </div>
                      )}

                    </div>

                    <div className="flex flex-wrap items-start gap-2">

                      <button
                        onClick={
                          () =>
                            resetPassword(
                              user.id,
                            )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600"
                      >
                        <KeyRound size={14} />
                        Reset
                      </button>

                      {user.status !== "INACTIVE" && (
                        <button
                          onClick={
                            () =>
                              deactivate(
                                user.id,
                              )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                        >
                          <UserRoundX size={14} />
                          Deactivate
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