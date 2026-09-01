"use client";

import {
  useRef,
  useState,
} from "react";

import {
  CheckCircle2,
  ScanLine,
} from "lucide-react";

import {
  HubApi,
} from "@/lib/hub-api";

export default function Page() {
  const [
    value,
    setValue,
  ] =
    useState("");

  const [
    scanType,
    setScanType,
  ] =
    useState(
      "HUB_SCAN",
    );

  const [
    result,
    setResult,
  ] =
    useState<any>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  async function scan() {
    if (!value.trim()) {
      return;
    }

    setError(null);

    try {
      const response =
        await HubApi.scan({
          scanValue:
            value.trim(),

          scanType,

          hubId:
            localStorage.getItem(
              "gogate_hub_id",
            ),
        });

      setResult(
        response,
      );

      setValue("");

      inputRef.current?.focus();
    } catch (
      err:
        any
    ) {
      setError(
        err?.message ??
        "Scan failed",
      );
    }
  }

  return (
    <div>

      <div className="text-sm font-black text-[#0284c7]">
        Gogate Products Hub
      </div>

      <h1 className="mt-1 text-3xl font-black">
        Scan Station
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Fast barcode scanning for inbound, sortation and outbound workflows.
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">

        <section className="gogate-card p-6">

          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
            <ScanLine size={26} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            Package Scanner
          </h2>

          <select
            value={
              scanType
            }
            onChange={
              event =>
                setScanType(
                  event.target.value,
                )
            }
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none focus:border-sky-400"
          >

            <option value="HUB_INBOUND">
              Hub Inbound
            </option>

            <option value="SORT">
              Sortation
            </option>

            <option value="BAGGING">
              Bagging
            </option>

            <option value="MANIFEST">
              Manifest
            </option>

            <option value="HUB_OUTBOUND">
              Hub Outbound
            </option>

          </select>

          <input
            ref={
              inputRef
            }
            autoFocus
            value={
              value
            }
            onChange={
              event =>
                setValue(
                  event.target.value,
                )
            }
            onKeyDown={
              event => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  scan();
                }
              }
            }
            placeholder="Scan barcode..."
            className="mt-3 w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-5 text-xl font-black outline-none focus:border-[#0284c7]"
          />

          <button
            onClick={
              scan
            }
            className="gogate-button mt-3 w-full rounded-2xl py-4 font-black"
          >
            Submit Scan
          </button>

          {error && (
            <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700">
              {error}
            </div>
          )}

        </section>

        <section className="gogate-card p-6">

          <h2 className="font-black">
            Latest Scan
          </h2>

          {!result ? (
            <div className="mt-5 grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
              Waiting for barcode scan
            </div>
          ) : (
            <div className="mt-5">

              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700">

                <CheckCircle2 size={21} />

                <span className="font-black">
                  Scan accepted
                </span>

              </div>

              <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
                {
                  JSON.stringify(
                    result,
                    null,
                    2,
                  )
                }
              </pre>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}