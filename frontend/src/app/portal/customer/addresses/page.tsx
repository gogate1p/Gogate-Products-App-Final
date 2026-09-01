"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  MapPin,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import {
  CustomerApi,
} from "@/lib/customer-api";

const emptyForm = {
  label: "Home",
  contactName: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pinCode: "",
  isDefault: false,
};

export default function Page() {
  const [rows, setRows] =
    useState<any[]>([]);

  const [form, setForm] =
    useState(emptyForm);

  const [error, setError] =
    useState("");

  async function load() {
    try {
      const data =
        await CustomerApi.addresses();

      setRows(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch (error: any) {
      setError(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(
    key: string,
    value: any,
  ) {
    setForm(
      current => ({
        ...current,
        [key]: value,
      }),
    );
  }

  async function add() {
    setError("");

    try {
      await CustomerApi.addAddress(
        form,
      );

      setForm(emptyForm);
      await load();
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">

      <h1 className="text-3xl font-black">
        Saved Addresses
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Save pickup and delivery addresses for faster booking.
      </p>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">

        <section className="rounded-3xl border border-slate-200 bg-white p-6">

          <div className="flex items-center gap-2 font-black">
            <Plus size={18} />
            Add Address
          </div>

          <div className="mt-5 space-y-3">

            {[
              ["label", "Label (Home / Work)"],
              ["contactName", "Contact Name"],
              ["phone", "Phone"],
              ["line1", "Address Line 1"],
              ["line2", "Address Line 2"],
              ["landmark", "Landmark"],
              ["city", "City"],
              ["state", "State"],
              ["pinCode", "PIN Code"],
            ].map(
              ([key, label]) => (
                <input
                  key={key}
                  value={
                    (form as any)[key]
                  }
                  onChange={
                    event =>
                      update(
                        key,
                        event.target.value,
                      )
                  }
                  placeholder={label}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-sky-400"
                />
              ),
            )}

          </div>

          <label className="mt-4 flex items-center gap-3 text-sm font-bold">
            <input
              type="checkbox"
              checked={
                form.isDefault
              }
              onChange={
                event =>
                  update(
                    "isDefault",
                    event.target.checked,
                  )
              }
            />
            Set as default
          </label>

          <button
            onClick={add}
            className="mt-5 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white"
          >
            Save Address
          </button>

        </section>

        <section className="grid content-start gap-4 sm:grid-cols-2">

          {rows.map(
            address => (
              <div
                key={address.id}
                className="rounded-3xl border border-slate-200 bg-white p-5"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-2">

                    <MapPin
                      size={19}
                      className="text-[#0284c7]"
                    />

                    <div className="font-black">
                      {address.label}
                    </div>

                  </div>

                  {address.isDefault && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                      DEFAULT
                    </span>
                  )}

                </div>

                <div className="mt-4 font-black">
                  {address.contactName}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {address.phone}
                </div>

                <div className="mt-3 text-sm leading-6 text-slate-500">
                  {address.line1}
                  {address.line2
                    ? `, ${address.line2}`
                    : ""}
                  <br />
                  {address.city}, {address.state} {address.pinCode}
                </div>

                <div className="mt-5 flex gap-2">

                  {!address.isDefault && (
                    <button
                      onClick={
                        async () => {
                          await CustomerApi.setDefaultAddress(
                            address.id,
                          );
                          await load();
                        }
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs font-black text-[#0284c7]"
                    >
                      <Star size={14} />
                      Default
                    </button>
                  )}

                  <button
                    onClick={
                      async () => {
                        await CustomerApi.removeAddress(
                          address.id,
                        );
                        await load();
                      }
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                </div>

              </div>
            ),
          )}

        </section>

      </div>

    </div>
  );
}