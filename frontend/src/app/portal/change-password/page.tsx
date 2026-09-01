"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  KeyRound,
} from "lucide-react";

import {
  PortalAuth,
} from "@/lib/portal-auth";

export default function Page() {
  const router =
    useRouter();

  const [
    currentPassword,
    setCurrentPassword,
  ] =
    useState("");

  const [
    newPassword,
    setNewPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
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

  async function submit() {
    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New passwords do not match.",
      );

      return;
    }

    if (
      newPassword.length <
      8
    ) {
      setError(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const result:
        any =
        await PortalAuth.changePassword(
          currentPassword,
          newPassword,
        );

      router.replace(
        result.redirectTo ??
        "/portal/login",
      );
    } catch (
      err: any
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

      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,.08)]">

        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0284c7] text-white">
          <KeyRound size={27} />
        </div>

        <div className="mt-6 text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
          Gogate Products
        </div>

        <h1 className="mt-2 text-3xl font-black">
          Create new password
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Your temporary password must be changed before continuing.
        </p>

        <input
          type="password"
          value={currentPassword}
          onChange={
            e =>
              setCurrentPassword(
                e.target.value,
              )
          }
          placeholder="Current temporary password"
          className="mt-7 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none"
        />

        <input
          type="password"
          value={newPassword}
          onChange={
            e =>
              setNewPassword(
                e.target.value,
              )
          }
          placeholder="New password"
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={
            e =>
              setConfirmPassword(
                e.target.value,
              )
          }
          placeholder="Confirm new password"
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none"
        />

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          onClick={submit}
          className="mt-5 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white disabled:opacity-60"
        >
          {
            loading
              ? "Updating..."
              : "Set Password"
          }
        </button>

      </div>

    </main>
  );
}