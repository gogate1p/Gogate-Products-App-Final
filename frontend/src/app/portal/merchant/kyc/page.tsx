"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  CheckCircle2,
  FileCheck2,
  Upload,
} from "lucide-react";

export default function Page() {
  const [submitted, setSubmitted] =
    useState(false);

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5">

        <div className="mx-auto mt-20 max-w-xl">

          <div className="gogate-card p-8 text-center">

            <CheckCircle2
              size={56}
              className="mx-auto text-emerald-500"
            />

            <h1 className="mt-5 text-2xl font-black">
              KYC submitted
            </h1>

            <p className="mt-3 leading-7 text-slate-500">
              Your business verification has been sent to the Gogate Products Admin Verification Center.
            </p>

            <div className="mt-6 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700">
              Shipment creation remains locked until your KYC status becomes VERIFIED.
            </div>

            <Link
              href="/"
              className="mt-6 inline-block font-black text-[#0284c7]"
            >
              Return home
            </Link>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5 sm:p-8">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/"
          className="font-black text-[#0284c7]"
        >
          ← Gogate Products
        </Link>

        <div className="gogate-card mt-8 p-6 sm:p-9">

          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">

            <div>

              <div className="text-xs font-black uppercase tracking-[.16em] text-[#0284c7]">
                Business Verification
              </div>

              <h1 className="mt-2 text-3xl font-black">
                Merchant / Shipper KYC
              </h1>

            </div>

            <span className="w-fit rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black text-orange-600">
              Verification required
            </span>

          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">

            <FileCheck2
              className="mt-0.5 shrink-0 text-[#0284c7]"
              size={20}
            />

            <p className="text-sm leading-6 text-slate-600">
              Business verification must be completed before shipment booking,
              bulk dispatch, manifests and Pidge-backed delivery functions are enabled.
            </p>

          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <input
              placeholder="Registered business name"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400 focus:bg-white"
            />

            <input
              placeholder="GSTIN"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400 focus:bg-white"
            />

            <input
              placeholder="Company PAN"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400 focus:bg-white"
            />

            <input
              placeholder="FSSAI (if applicable)"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400 focus:bg-white"
            />

            <input
              placeholder="Authorized person"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400 focus:bg-white"
            />

            <input
              placeholder="Mobile number"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400 focus:bg-white"
            />

            <textarea
              placeholder="Registered business address"
              className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400 focus:bg-white sm:col-span-2"
            />

          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            {[
              "GST Certificate",
              "PAN Document",
              "Business Address Proof",
              "Bank Proof / Cancelled Cheque",
            ].map((document) => (
              <label
                key={document}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 transition hover:border-sky-300 hover:bg-sky-50"
              >

                <Upload
                  size={21}
                  className="text-[#0284c7]"
                />

                <div className="mt-3 text-sm font-black">
                  {document}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  Upload PDF / PNG / JPG
                </div>

                <input
                  type="file"
                  className="mt-3 text-xs"
                />

              </label>
            ))}

          </div>

          <button
            onClick={() =>
              setSubmitted(true)
            }
            className="gogate-button mt-7 w-full rounded-2xl py-4 font-black"
          >
            Submit for Admin Verification
          </button>

        </div>

      </div>

    </main>
  );
}