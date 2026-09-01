"use client";

import Link from "next/link";

import {
  Boxes,
  LockKeyhole,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-5 py-10">

      <div className="mx-auto grid min-h-[85vh] max-w-5xl items-center gap-10 lg:grid-cols-2">

        <div className="hidden lg:block">

          <div className="inline-flex items-center gap-3">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0284c7] text-white">
              <Boxes />
            </div>

            <div>

              <div className="text-xl font-black">
                Gogate Products
              </div>

              <div className="text-xs font-bold uppercase tracking-[.16em] text-[#0284c7]">
                Logistics Platform
              </div>

            </div>

          </div>

          <h1 className="mt-10 text-5xl font-black leading-tight">
            Welcome back to your logistics workspace.
          </h1>

          <p className="mt-5 max-w-md leading-7 text-slate-500">
            Track shipments, manage deliveries and access your Gogate Products portal.
          </p>

        </div>

        <div className="gogate-card p-6 sm:p-9">

          <Link
            href="/"
            className="font-black text-[#0284c7]"
          >
            ← Home
          </Link>

          <h2 className="mt-7 text-3xl font-black">
            Sign in
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Access your Gogate Products account.
          </p>

          <form className="mt-8 space-y-4">

            <label className="block">

              <span className="mb-2 block text-sm font-black text-slate-700">
                Email
              </span>

              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-sky-400 focus-within:bg-white">

                <Mail
                  size={18}
                  className="text-slate-400"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

              </div>

            </label>

            <label className="block">

              <span className="mb-2 block text-sm font-black text-slate-700">
                Password
              </span>

              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-sky-400 focus-within:bg-white">

                <LockKeyhole
                  size={18}
                  className="text-slate-400"
                />

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

              </div>

            </label>

            <button
              type="button"
              className="gogate-button flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-black"
            >
              Sign In
              <ArrowRight size={17} />
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to Gogate Products?{" "}

            <Link
              href="/signup"
              className="font-black text-[#0284c7]"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}