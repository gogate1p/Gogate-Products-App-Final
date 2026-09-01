"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BranchApi,
} from "@/lib/branch-api";

export default function Page() {
  const [users, setUsers] =
    useState<any[]>([]);

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState(
      "BRANCH_STAFF",
    );

  const [credentials, setCredentials] =
    useState<any>(null);

  async function load() {
    const response =
      await BranchApi.users();

    setUsers(
      Array.isArray(response)
        ? response
        : [],
    );
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const response =
      await BranchApi.createUser({
        phone,
        email:
          email || undefined,
        role,
      });

    setCredentials(
      response.credentials,
    );

    setPhone("");
    setEmail("");

    await load();
  }

  return (
    <div>

      <h1 className="text-3xl font-black">
        Branch Users
      </h1>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.7fr_1.3fr]">

        <section className="rounded-3xl border border-slate-200 bg-white p-6">

          <h2 className="font-black">
            Create Branch User
          </h2>

          <input
            value={phone}
            onChange={
              e =>
                setPhone(
                  e.target.value,
                )
            }
            placeholder="Mobile number"
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <input
            value={email}
            onChange={
              e =>
                setEmail(
                  e.target.value,
                )
            }
            placeholder="Email"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <select
            value={role}
            onChange={
              e =>
                setRole(
                  e.target.value,
                )
            }
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >

            <option value="REGIONAL_MANAGER">
              Regional Manager
            </option>

            <option value="BRANCH_MANAGER">
              Branch Manager
            </option>

            <option value="BRANCH_STAFF">
              Branch Staff
            </option>

            <option value="BOOKING_AGENT">
              Booking Agent
            </option>

          </select>

          <button
            onClick={create}
            className="mt-4 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white"
          >
            Create User
          </button>

          {credentials && (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-5">

              <div className="font-black text-emerald-700">
                Account Created
              </div>

              <div className="mt-3">
                User ID:
                <strong className="ml-2">
                  {credentials.userId}
                </strong>
              </div>

              <div className="mt-2">
                Password:
                <strong className="ml-2">
                  {credentials.password}
                </strong>
              </div>

            </div>
          )}

        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

          <div className="border-b border-slate-100 p-5 font-black">
            Users ({users.length})
          </div>

          <div className="divide-y divide-slate-100">

            {users.map(
              user => (
                <div
                  key={user.id}
                  className="p-5"
                >

                  <div className="font-black">
                    {
                      user.userCode ??
                      user.id
                    }
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {user.phone}
                  </div>

                  <div className="mt-2 inline-block rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black text-[#0284c7]">
                    {user.role}
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