"use client";

import {
  useState,
} from "react";

import {
  BranchApi,
} from "@/lib/branch-api";

export default function Page() {
  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [pinCode, setPinCode] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  async function submit() {
    try {
      setError("");

      const response =
        await BranchApi.createShipment({
          customerName,
          customerPhone,

          deliveryAddress:
            address,

          deliveryPinCode:
            pinCode,

          totalAmount:
            0,

          items:
            [],
        });

      setResult(response);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-3xl">

      <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
        Gogate Products
      </div>

      <h1 className="mt-2 text-3xl font-black">
        Book Shipment
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Create a walk-in or customer courier booking.
      </p>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">

        <div className="grid gap-4 sm:grid-cols-2">

          <Field
            label="Customer Name"
            value={customerName}
            setValue={setCustomerName}
          />

          <Field
            label="Mobile Number"
            value={customerPhone}
            setValue={setCustomerPhone}
          />

          <Field
            label="Delivery PIN"
            value={pinCode}
            setValue={setPinCode}
          />

          <div className="sm:col-span-2">

            <Field
              label="Delivery Address"
              value={address}
              setValue={setAddress}
            />

          </div>

        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={submit}
          className="mt-5 rounded-2xl bg-[#0284c7] px-7 py-4 font-black text-white"
        >
          Generate Shipment & AWB
        </button>

        {result && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">

            <div className="text-sm font-black text-emerald-700">
              Shipment Booked
            </div>

            <div className="mt-2 text-3xl font-black tracking-wider text-slate-900">
              {result.awb}
            </div>

            <div className="mt-1 text-xs font-bold text-slate-500">
              12-digit Gogate Products AWB
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

function Field({
  label,
  value,
  setValue,
}: any) {
  return (
    <label className="block">

      <div className="mb-2 text-xs font-black text-slate-600">
        {label}
      </div>

      <input
        value={value}
        onChange={
          e =>
            setValue(
              e.target.value,
            )
        }
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400"
      />

    </label>
  );
}