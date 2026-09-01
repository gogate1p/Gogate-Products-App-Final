"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  MapPin,
  PackagePlus,
  Phone,
  UserRound,
} from "lucide-react";

import {
  BranchApi,
} from "@/lib/branch-api";

export default function Page() {
  const router =
    useRouter();

  const [form, setForm] =
    useState({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      address: "",
      pinCode: "",
      requestedDate: "",
      timeWindow: "",
      packageCount: "1",
      estimatedWeight: "",
      remarks: "",
    });

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  function set(
    key: string,
    value: string,
  ) {
    setForm(
      current => ({
        ...current,
        [key]: value,
      }),
    );
  }

  async function submit() {
    setError("");

    try {
      const response =
        await BranchApi.createPickup({
          ...form,

          packageCount:
            Number(form.packageCount || 1),

          estimatedWeight:
            form.estimatedWeight
              ? Number(form.estimatedWeight)
              : undefined,
        });

      setResult(response);
    } catch (err: any) {
      setError(
        err?.message ??
        "Pickup booking failed.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-4xl">

      <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
        Gogate Products
      </div>

      <h1 className="mt-2 text-3xl font-black">
        Book Pickup
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Create a pickup request for a customer or walk-in booking.
      </p>

      <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6">

        <div className="grid gap-4 sm:grid-cols-2">

          <Field
            icon={UserRound}
            label="Customer Name"
            value={form.customerName}
            onChange={(value: string) =>
                set("customerName", value)
            }
          />

          <Field
            icon={Phone}
            label="Mobile Number"
            value={form.customerPhone}
            onChange={(value: string) =>
                set("customerPhone", value)
            }
          />

          <Field
            label="Email"
            value={form.customerEmail}
            onChange={(value: string) =>
                set("customerEmail", value)
            }
          />

          <Field
            label="PIN Code"
            value={form.pinCode}
            onChange={(value: string) =>
                set("pinCode", value)
            }
          />

          <div className="sm:col-span-2">

            <Field
              icon={MapPin}
              label="Pickup Address"
              value={form.address}
              onChange={(value: string) =>
                  set("address", value)
              }
            />

          </div>

          <Field
            icon={CalendarDays}
            label="Requested Date"
            type="date"
            value={form.requestedDate}
            onChange={(value: string) =>
                set("requestedDate", value)
            }
          />

          <Field
            label="Time Window"
            value={form.timeWindow}
            onChange={(value: string) =>
                set("timeWindow", value)
            }
            placeholder="10:00 - 13:00"
          />

          <Field
            label="Package Count"
            type="number"
            value={form.packageCount}
            onChange={(value: string) =>
                set("packageCount", value)
            }
          />

          <Field
            label="Estimated Weight (kg)"
            type="number"
            value={form.estimatedWeight}
            onChange={(value: string) =>
                set("estimatedWeight", value)
            }
          />

          <div className="sm:col-span-2">

            <Field
              label="Remarks"
              value={form.remarks}
              onChange={(value: string) =>
                  set("remarks", value)
              }
            />

          </div>

        </div>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">

          <button
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0284c7] px-6 py-4 font-black text-white"
          >
            <PackagePlus size={18} />
            Create Pickup
          </button>

          <button
            onClick={() =>
              router.push(
                "/portal/branch/pickups",
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-700"
          >
            Back
          </button>

        </div>

        {result && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">

            <div className="text-sm font-black text-emerald-700">
              Pickup successfully booked
            </div>

            <div className="mt-2 text-3xl font-black tracking-wider text-slate-900">
              {result.pickupCode}
            </div>

            <div className="mt-1 text-xs font-bold text-slate-500">
              Gogate Products Pickup ID
            </div>

          </div>
        )}

      </section>

    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: any) {
  return (
    <label className="block">

      <div className="mb-2 text-xs font-black text-slate-600">
        {label}
      </div>

      <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">

        {Icon && (
          <Icon
            size={17}
            className="text-[#0284c7]"
          />
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={
            e =>
              onChange(
                e.target.value,
              )
          }
          className="w-full bg-transparent px-3 py-4 outline-none"
        />

      </div>

    </label>
  );
}