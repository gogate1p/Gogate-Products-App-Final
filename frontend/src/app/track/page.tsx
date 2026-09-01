import { Suspense } from "react";

import TrackClient from "./TrackClient";

function TrackingLoading() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-3xl">

          <div className="h-4 w-32 animate-pulse rounded-full bg-sky-100" />

          <div className="mt-5 h-11 w-3/4 animate-pulse rounded-2xl bg-slate-200" />

          <div className="mt-3 h-5 w-1/2 animate-pulse rounded-xl bg-slate-100" />

          <div className="mt-10 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.06)]">

            <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />

            <div className="mt-4 h-14 animate-pulse rounded-2xl bg-slate-100" />

            <div className="mt-6 h-14 w-40 animate-pulse rounded-2xl bg-sky-100" />

          </div>

        </div>

      </div>

    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackingLoading />}>
      <TrackClient />
    </Suspense>
  );
}