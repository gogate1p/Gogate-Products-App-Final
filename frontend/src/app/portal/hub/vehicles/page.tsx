"use client";

import {
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function Page() {
  return (
    <div>

      <div className="text-sm font-black text-[#0284c7]">
        Gogate Products Hub
      </div>

      <h1 className="mt-1 text-3xl font-black">
        Vehicle Verification
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Verify rider and operational vehicles assigned to the hub.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">

        <div className="gogate-card p-5">

          <Truck
            className="text-[#0284c7]"
          />

          <div className="mt-4 text-2xl font-black">
            Vehicle Registry
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Vehicle verification operations use the existing workforce vehicle APIs.
          </p>

        </div>

        <div className="gogate-card p-5">

          <ShieldCheck
            className="text-emerald-500"
          />

          <div className="mt-4 text-2xl font-black">
            RC / Insurance
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Review registration, insurance, permit and expiry information.
          </p>

        </div>

      </div>

    </div>
  );
}