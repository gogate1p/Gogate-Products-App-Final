"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Building2,
  LockKeyhole,
  UserRound,
} from "lucide-react";

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
    error,
    setError,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  async function login() {
    setLoading(true);
    setError("");

    try {
      const API =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:3000";

      const response =
        await fetch(
          `${API}/auth/login`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                loginId,
                phone:
                  loginId,
                userId:
                  loginId,
                password,
              }),
          },
        );

      const body =
        await response.json();

      if (!response.ok) {
        throw new Error(
          body?.message ??
          "Login failed",
        );
      }

      const token =
        body.access_token ??
        body.accessToken ??
        body.token;

      if (!token) {
        throw new Error(
          "Login token was not returned.",
        );
      }

      localStorage.setItem(
        "gogate_access_token",
        token,
      );

      router.replace(
        "/portal/hub",
      );
    } catch (
      err:
        any
    ) {
      setError(
        err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5">

      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_25px_70px_rgba(15,23,42,.08)]">

        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0284c7] text-white">
          <Building2 size={27} />
        </div>

        <div className="mt-6 text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
          Gogate Products
        </div>

        <h1 className="mt-2 text-3xl font-black">
          Hub Portal
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Authorized hub personnel and administrators only.
        </p>

        <div className="mt-7">

          <label className="text-xs font-black text-slate-600">
            User ID / Mobile
          </label>

          <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">

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
              className="w-full bg-transparent px-3 py-4 outline-none"
              placeholder="12-digit User ID"
            />

          </div>

          <label className="mt-5 block text-xs font-black text-slate-600">
            Password
          </label>

          <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">

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
              className="w-full bg-transparent px-3 py-4 outline-none"
              placeholder="Password"
            />

          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white shadow-[0_12px_30px_rgba(2,132,199,.2)]"
          >
            {
              loading
                ? "Signing in..."
                : "Login to Hub"
            }
          </button>

        </div>

      </div>

    </main>
  );
}