"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  PortalAuth,
} from "@/lib/portal-auth";

export default function Page() {
  const router =
    useRouter();

  const [
    loginId,
    setLoginId,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function login() {
    if (
      !loginId.trim() ||
      !password
    ) {
      setError(
        "Enter your User ID, phone or email and password.",
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const result =
        await PortalAuth.login(
          loginId.trim(),
          password,
        );

      router.replace(
        result.redirectTo ??
        "/",
      );
    } catch (
      err: any
    ) {
      setError(
        err?.message ??
        "Login failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5">

      <div className="absolute left-[-100px] top-[-100px] h-[330px] w-[330px] rounded-full bg-sky-200/30 blur-3xl" />

      <div className="absolute bottom-[-100px] right-[-100px] h-[330px] w-[330px] rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative w-full max-w-[440px] rounded-[34px] border border-white/80 bg-white/90 p-7 shadow-[0_30px_90px_rgba(15,23,42,.10)] backdrop-blur-xl sm:p-9">

        <div className="flex items-center gap-3">

          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0284c7] text-white shadow-[0_12px_30px_rgba(2,132,199,.25)]">
            <ShieldCheck
              size={27}
            />
          </div>

          <div>

            <div className="font-black text-slate-900">
              Gogate Products
            </div>

            <div className="text-xs font-bold text-slate-400">
              Logistics Operations Platform
            </div>

          </div>

        </div>

        <div className="mt-8 text-[11px] font-black uppercase tracking-[.18em] text-[#0284c7]">
          Secure workspace
        </div>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Sign in
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use your 12-digit Gogate Products User ID, registered mobile number or email.
        </p>

        <label className="mt-7 block text-xs font-black text-slate-600">
          User ID / Mobile / Email
        </label>

        <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-sky-400">

          <UserRound
            size={18}
            className="text-[#0284c7]"
          />

          <input
            value={loginId}
            onChange={
              event =>
                setLoginId(
                  event.target.value,
                )
            }
            placeholder="Enter login ID"
            autoComplete="username"
            className="w-full bg-transparent px-3 py-4 outline-none"
          />

        </div>

        <label className="mt-5 block text-xs font-black text-slate-600">
          Password
        </label>

        <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-sky-400">

          <LockKeyhole
            size={18}
            className="text-[#0284c7]"
          />

          <input
            type="password"
            value={password}
            onChange={
              event =>
                setPassword(
                  event.target.value,
                )
            }
            onKeyDown={
              event => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  login();
                }
              }
            }
            autoComplete="current-password"
            placeholder="Password"
            className="w-full bg-transparent px-3 py-4 outline-none"
          />

        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          onClick={login}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0284c7] py-4 font-black text-white shadow-[0_12px_30px_rgba(2,132,199,.20)] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <KeyRound
            size={18}
          />

          {
            loading
              ? "Signing in..."
              : "Continue"
          }
        </button>

      </div>

    </main>
  );
}