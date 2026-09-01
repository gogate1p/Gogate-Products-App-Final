"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Bike,
  Box,
  CheckCircle2,
  Truck,
} from "lucide-react";

import {
  CustomerApi,
} from "@/lib/customer-api";

export default function Page() {
  const router =
    useRouter();

  const [serviceType, setServiceType] =
    useState<
      "NORMAL" |
      "HYPERLOCAL"
    >("NORMAL");

  const [sender, setSender] =
    useState({
      name: "",
      phone: "",
      address: "",
      pinCode: "",
    });

  const [receiver, setReceiver] =
    useState({
      name: "",
      phone: "",
      address: "",
      pinCode: "",
    });

  const [weight, setWeight] =
    useState("");

  const [declaredValue, setDeclaredValue] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("PREPAID");

  const [description, setDescription] =
    useState("Parcel");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  async function submit() {
    setError("");

    if (
      !sender.name ||
      !sender.phone ||
      !sender.address ||
      !sender.pinCode ||
      !receiver.name ||
      !receiver.phone ||
      !receiver.address ||
      !receiver.pinCode
    ) {
      setError(
        "Complete sender and receiver details.",
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await CustomerApi.createShipment({
          serviceType,
          sender,
          receiver,
          weight:
            weight
              ? Number(weight)
              : undefined,
          declaredValue:
            declaredValue
              ? Number(declaredValue)
              : undefined,
          description,
          paymentMethod,
        });

      setResult(response);
    } catch (error: any) {
      setError(
        error.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">

      <div className="text-xs font-black uppercase tracking-[.18em] text-[#0284c7]">
        New Shipment
      </div>

      <h1 className="mt-2 text-3xl font-black">
        Send a Package
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Choose your delivery service and enter shipment details.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <button
          type="button"
          onClick={
            () =>
              setServiceType(
                "NORMAL",
              )
          }
          className={`rounded-3xl border p-5 text-left ${
            serviceType === "NORMAL"
              ? "border-[#0284c7] bg-sky-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <Truck
            className="text-[#0284c7]"
            size={25}
          />

          <div className="mt-4 font-black">
            Normal Courier
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Intercity and standard courier delivery.
          </div>
        </button>

        <button
          type="button"
          onClick={
            () =>
              setServiceType(
                "HYPERLOCAL",
              )
          }
          className={`rounded-3xl border p-5 text-left ${
            serviceType === "HYPERLOCAL"
              ? "border-[#0284c7] bg-sky-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <Bike
            className="text-[#0284c7]"
            size={25}
          />

          <div className="mt-4 font-black">
            Hyperlocal
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Same-city fast local delivery.
          </div>
        </button>

      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <AddressForm
          title="Pickup / Sender"
          value={sender}
          onChange={setSender}
        />

        <AddressForm
          title="Receiver"
          value={receiver}
          onChange={setReceiver}
        />

      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">

        <h2 className="font-black">
          Package Details
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <Input
            label="Description"
            value={description}
            onChange={setDescription}
          />

          <Input
            label="Weight (kg)"
            value={weight}
            onChange={setWeight}
            type="number"
          />

          <Input
            label="Declared Value (₹)"
            value={declaredValue}
            onChange={setDeclaredValue}
            type="number"
          />

          <label>
            <div className="mb-2 text-xs font-black text-slate-600">
              Payment Method
            </div>

            <select
              value={paymentMethod}
              onChange={
                event =>
                  setPaymentMethod(
                    event.target.value,
                  )
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <option value="PREPAID">
                Prepaid
              </option>

              <option value="COD">
                Cash on Delivery
              </option>
            </select>
          </label>

        </div>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 rounded-2xl bg-[#0284c7] px-7 py-4 font-black text-white disabled:opacity-50"
        >
          {
            loading
              ? "Creating shipment..."
              : `Book ${
                  serviceType ===
                  "HYPERLOCAL"
                    ? "Hyperlocal"
                    : "Courier"
                }`
          }
        </button>

        {result && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">

            <div className="flex items-center gap-2 font-black text-emerald-700">
              <CheckCircle2 size={19} />
              Shipment Created
            </div>

            <div className="mt-3 text-xs font-bold text-slate-500">
              Shipment / AWB ID
            </div>

            <button
              onClick={
                () =>
                  router.push(
                    `/track?awb=${result.awb}`,
                  )
              }
              className="mt-1 text-3xl font-black tracking-widest text-[#0284c7]"
            >
              {result.awb}
            </button>

            <div className="mt-2 text-xs text-slate-500">
              Click the shipment ID to track.
            </div>

          </div>
        )}

      </section>

    </div>
  );
}

function AddressForm({
  title,
  value,
  onChange,
}: any) {
  function update(
    key: string,
    text: string,
  ) {
    onChange({
      ...value,
      [key]: text,
    });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">

      <h2 className="font-black">
        {title}
      </h2>

      <div className="mt-5 space-y-4">

        <Input
          label="Name"
          value={value.name}
          onChange={
            (text: string) =>
              update(
                "name",
                text,
              )
          }
        />

        <Input
          label="Phone"
          value={value.phone}
          onChange={
            (text: string) =>
              update(
                "phone",
                text,
              )
          }
        />

        <Input
          label="Address"
          value={value.address}
          onChange={
            (text: string) =>
              update(
                "address",
                text,
              )
          }
        />

        <Input
          label="PIN Code"
          value={value.pinCode}
          onChange={
            (text: string) =>
              update(
                "pinCode",
                text,
              )
          }
        />

      </div>

    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">

      <div className="mb-2 text-xs font-black text-slate-600">
        {label}
      </div>

      <input
        type={type}
        value={value}
        onChange={
          event =>
            onChange(
              event.target.value,
            )
        }
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-sky-400"
      />

    </label>
  );
}