"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Building2,
} from "lucide-react";

import {
  BranchApi,
  selectBranch,
} from "@/lib/branch-api";

export default function Page() {
  const router =
    useRouter();

  const [loginId, setLoginId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function login() {
    try {
      setError("");

      await BranchApi.login(
        loginId,
        password,
      );

      const branches:
        any[] =
        await BranchApi.branches();

      if (branches.length) {
        selectBranch(
          branches[0].id,
        );
      }

      router.replace(
        "/portal/branch",
      );
    } catch (err: any) {
      setError(
        err.message,
      );
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5">

      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,.08)]">

        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0284c7] text-white">
          <Building2 size={27} />
        </div>

        <div className="mt-6 text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
          Gogate Products
        </div>

        <h1 className="mt-2 text-3xl font-black">
          Courier Branch
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Staff, managers and regional operations login.
        </p>

        <input
          value={loginId}
          onChange={
            e =>
              setLoginId(
                e.target.value,
              )
          }
          placeholder="12-digit User ID / Mobile"
          className="mt-7 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400"
        />

        <input
          type="password"
          value={password}
          onChange={
            e =>
              setPassword(
                e.target.value,
              )
          }
          placeholder="Password"
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400"
        />

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={login}
          className="mt-5 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white"
        >
          Login to Branch
        </button>

      </div>

    </main>
  );
}