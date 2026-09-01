"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CreditCard,
  Trash2,
  WalletCards,
} from "lucide-react";

import {
  CustomerApi,
} from "@/lib/customer-api";

export default function Page() {
  const [methods, setMethods] =
    useState<any[]>([]);

  const [type, setType] =
    useState("UPI");

  const [label, setLabel] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [last4, setLast4] =
    useState("");

  const [error, setError] =
    useState("");

  async function load() {
    try {
      const data =
        await CustomerApi.paymentMethods();

      setMethods(
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

  async function add() {
    try {
      setError("");

      await CustomerApi.addPaymentMethod({
        type,
        label:
          label || type,
        brand:
          type === "CARD"
            ? brand
            : undefined,
        last4:
          type === "CARD"
            ? last4
            : undefined,
        isDefault:
          methods.length === 0,
      });

      setLabel("");
      setBrand("");
      setLast4("");

      await load();
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="text-3xl font-black">
        Payment Methods
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Manage payment preferences. Full card numbers and CVVs are never stored by Gogate Products.
      </p>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">

        <section className="rounded-3xl border border-slate-200 bg-white p-6">

          <div className="flex items-center gap-2 font-black">
            <WalletCards size={19} />
            Add Payment Method
          </div>

          <select
            value={type}
            onChange={
              event =>
                setType(
                  event.target.value,
                )
            }
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <option value="UPI">
              UPI
            </option>

            <option value="CARD">
              Tokenized Card
            </option>

            <option value="COD">
              Cash on Delivery
            </option>
          </select>

          <input
            value={label}
            onChange={
              event =>
                setLabel(
                  event.target.value,
                )
            }
            placeholder={
              type === "UPI"
                ? "e.g. Personal UPI"
                : "Display label"
            }
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          {type === "CARD" && (
            <>
              <input
                value={brand}
                onChange={
                  event =>
                    setBrand(
                      event.target.value,
                    )
                }
                placeholder="Card brand (Visa / Mastercard)"
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              />

              <input
                maxLength={4}
                value={last4}
                onChange={
                  event =>
                    setLast4(
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                }
                placeholder="Last 4 digits only"
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              />
            </>
          )}

          <button
            onClick={add}
            className="mt-5 w-full rounded-2xl bg-[#0284c7] py-4 font-black text-white"
          >
            Add Method
          </button>

        </section>

        <section className="space-y-4">

          {!methods.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-400">
              No saved payment methods.
            </div>
          ) : (
            methods.map(
              method => (
                <div
                  key={method.id}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5"
                >

                  <div className="flex items-center gap-4">

                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
                      <CreditCard size={20} />
                    </div>

                    <div>

                      <div className="font-black">
                        {
                          method.label ??
                          method.type
                        }
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {method.type}
                        {
                          method.last4
                            ? ` •••• ${method.last4}`
                            : ""
                        }
                      </div>

                    </div>

                  </div>

                  <button
                    onClick={
                      async () => {
                        await CustomerApi.deletePaymentMethod(
                          method.id,
                        );
                        await load();
                      }
                    }
                    className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>
              ),
            )
          )}

        </section>

      </div>

    </div>
  );
}