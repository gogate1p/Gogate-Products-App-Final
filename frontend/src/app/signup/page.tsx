"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  PackageCheck,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";

type AccountType =
  | "CUSTOMER"
  | "SHIPPER"
  | "MERCHANT";

const API =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

const accountTypes = [
  {
    value:
      "CUSTOMER" as AccountType,

    title:
      "Customer",

    description:
      "Send, receive and track personal shipments.",

    icon:
      UserRound,
  },

  {
    value:
      "SHIPPER" as AccountType,

    title:
      "Shipper",

    description:
      "Business shipping, pickup booking and logistics management.",

    icon:
      Truck,
  },

  {
    value:
      "MERCHANT" as AccountType,

    title:
      "Merchant",

    description:
      "E-commerce shipping, orders, COD and fulfilment.",

    icon:
      Building2,
  },
];

export default function Page() {
  const router =
    useRouter();

  const [
    accountType,
    setAccountType,
  ] =
    useState<AccountType>(
      "CUSTOMER",
    );

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

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

  const [
    success,
    setSuccess,
  ] =
    useState<any>(
      null,
    );

  async function createAccount() {
    if (loading) {
      return;
    }

    setError("");
    setSuccess(null);

    if (!phone.trim()) {
      setError(
        "Enter your mobile number.",
      );

      return;
    }

    if (
      !/^[0-9]{10,15}$/.test(
        phone.trim(),
      )
    ) {
      setError(
        "Enter a valid mobile number.",
      );

      return;
    }

    if (
      password.length < 8
    ) {
      setError(
        "Password must be at least 8 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API}/public-auth/signup`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                accountType,
                phone:
                  phone.trim(),

                email:
                  email.trim() ||
                  undefined,

                password,
              }),
          },
        );

      const contentType =
        response.headers.get(
          "content-type",
        );

      const body =
        contentType?.includes(
          "application/json",
        )
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw new Error(
          body?.message ??
          body?.error ??
          String(body) ??
          "Account creation failed.",
        );
      }

      if (
        body.accessToken
      ) {
        localStorage.setItem(
          "gogate_access_token",
          body.accessToken,
        );
      }

      setSuccess(
        body,
      );

      setTimeout(
        () => {
          router.push(
            body.redirectTo ??
            "/portal/customer",
          );
        },
        900,
      );
    } catch (
      err: any
    ) {
      setError(
        err?.message ??
        "Unable to create account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">

      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-sky-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">

        <section className="hidden lg:block">

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-xs font-black text-[#0284c7] shadow-sm">

            <PackageCheck size={15} />

            GOGATE PRODUCTS LOGISTICS

          </div>

          <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.05] tracking-tight text-slate-900">

            Your logistics account,
            built for the way you ship.

          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">

            Book pickups, manage shipments, track deliveries and access Gogate Products logistics operations from one account.

          </p>

          <div className="mt-9 space-y-4">

            {[
              "12-digit Gogate Products User ID",
              "Real-time shipment tracking",
              "Business pickup and shipping tools",
              "Secure role-based account access",
            ].map(
              item => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >

                  <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={17} />
                  </div>

                  <span className="font-bold text-slate-600">
                    {item}
                  </span>

                </div>
              ),
            )}

          </div>

        </section>

        <section className="mx-auto w-full max-w-xl rounded-[34px] border border-white/80 bg-white/90 p-6 shadow-[0_30px_90px_rgba(15,23,42,.10)] backdrop-blur-xl sm:p-8">

          <div className="flex items-center gap-3">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0284c7] text-white">
              <ShieldCheck size={23} />
            </div>

            <div>

              <div className="font-black text-slate-900">
                Gogate Products
              </div>

              <div className="text-xs font-bold text-slate-400">
                Create logistics account
              </div>

            </div>

          </div>

          <h2 className="mt-7 text-3xl font-black tracking-tight text-slate-900">
            Create account
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose how you will use Gogate Products.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">

            {accountTypes.map(
              item => {
                const Icon =
                  item.icon;

                const active =
                  accountType ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={
                      () =>
                        setAccountType(
                          item.value,
                        )
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#0284c7] bg-sky-50 shadow-[0_8px_24px_rgba(2,132,199,.10)]"
                        : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/40"
                    }`}
                  >

                    <div
                      className={`grid h-9 w-9 place-items-center rounded-xl ${
                        active
                          ? "bg-[#0284c7] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="mt-3 text-sm font-black text-slate-900">
                      {item.title}
                    </div>

                    <div className="mt-1 text-[11px] leading-4 text-slate-500">
                      {item.description}
                    </div>

                  </button>
                );
              },
            )}

          </div>

          {(accountType === "SHIPPER" ||
            accountType === "MERCHANT") && (
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-700">
              Business accounts require KYC verification before shipment booking is enabled.
            </div>
          )}

          <label className="mt-6 block text-xs font-black text-slate-600">
            Mobile Number
          </label>

          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={
              event =>
                setPhone(
                  event.target.value.replace(
                    /\D/g,
                    "",
                  ),
                )
            }
            placeholder="10-digit mobile number"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-sky-400 focus:bg-white"
          />

          <label className="mt-4 block text-xs font-black text-slate-600">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={
              event =>
                setEmail(
                  event.target.value,
                )
            }
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-sky-400 focus:bg-white"
          />

          <label className="mt-4 block text-xs font-black text-slate-600">
            Password
          </label>

          <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-sky-400 focus-within:bg-white">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={
                event =>
                  setPassword(
                    event.target.value,
                  )
              }
              placeholder="Minimum 8 characters"
              className="w-full bg-transparent py-4 outline-none"
            />

            <button
              type="button"
              onClick={
                () =>
                  setShowPassword(
                    current =>
                      !current,
                  )
              }
              className="text-slate-400"
            >
              {showPassword
                ? <EyeOff size={18} />
                : <Eye size={18} />}
            </button>

          </div>

          <label className="mt-4 block text-xs font-black text-slate-600">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={
              event =>
                setConfirmPassword(
                  event.target.value,
                )
            }
            onKeyDown={
              event => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  createAccount();
                }
              }
            }
            placeholder="Confirm password"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-sky-400 focus:bg-white"
          />

          {error && (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

              <div className="flex items-center gap-2 font-black text-emerald-700">
                <CheckCircle2 size={18} />
                Account created
              </div>

              <div className="mt-2 text-xs text-emerald-700">
                Gogate Products User ID:
              </div>

              <div className="mt-1 text-xl font-black tracking-wider text-slate-900">
                {success.user?.userId}
              </div>

            </div>
          )}

          <button
            type="button"
            onClick={createAccount}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0284c7] py-4 font-black text-white shadow-[0_14px_35px_rgba(2,132,199,.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {
              loading
                ? "Creating account..."
                : "Create Account"
            }

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

          <div className="mt-6 text-center text-sm text-slate-500">

            Already have an account?

            <Link
              href="/portal/login"
              className="ml-2 font-black text-[#0284c7]"
            >
              Sign in
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}