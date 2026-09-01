"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import QRCode from "react-qr-code";
import Barcode from "react-barcode";

import {
  CustomerTrackingApi,
} from "@/lib/shipment-tracking-api";

export default function Page() {
  const params =
    useParams();

  const awb =
    String(
      params.awb,
    );

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {

    CustomerTrackingApi
      .details(
        awb,
      )
      .then(
        setData,
      );

  }, [
    awb,
  ]);

  if (!data) {
    return (
      <div className="p-10">
        Loading shipping label...
      </div>
    );
  }

  const shipment =
    data.shipment;

  const sender =
    data.sender ??
    {};

  const receiver =
    data.receiver ??
    {};

  const destinationCode =
    shipment.destinationHub
      ?.shortCode ??
    shipment.destinationHub
      ?.name
      ?.replace(
        /[^A-Za-z]/g,
        "",
      )
      .slice(
        0,
        5,
      )
      .toUpperCase() ??
    "TBA";

  return (
    <main className="mx-auto max-w-[760px] bg-white p-8 text-black">

      <div className="flex items-start justify-between border-b-4 border-black pb-4">

        <div>

          <div className="text-3xl font-black">
            Gogate Products
          </div>

          <div className="mt-1 text-sm font-black">
            SHIPPING LABEL
          </div>

        </div>

        <button
          onClick={
            () =>
              window.print()
          }
          className="rounded-xl bg-[#16883e] px-4 py-2 font-black text-white print:hidden"
        >
          PRINT
        </button>

      </div>


      <div className="mt-5 grid grid-cols-[1fr_155px] gap-5 border-4 border-black p-5">

        <div>

          <div className="text-xs font-black">
            SHIPMENT / AWB
          </div>

          <div className="mt-1 text-4xl font-black tracking-[.13em]">
            {shipment.awb}
          </div>

          <div className="mt-5">

            <Barcode
              value={
                shipment.awb
              }
              format="CODE128"
              displayValue={false}
              height={58}
              width={1.6}
              margin={0}
            />

          </div>

        </div>


        <div className="flex flex-col items-center justify-center border-l-2 border-black pl-5">

          <QRCode
            value={`GOGATE:SHIPMENT:${shipment.awb}`}
            size={125}
            level="M"
          />

          <div className="mt-2 text-center text-[10px] font-black">
            SCAN SHIPMENT QR
          </div>

        </div>

      </div>


      <div className="grid grid-cols-2 border-x-4 border-b-4 border-black">

        <div className="border-r-2 border-black p-5">

          <div className="text-xs font-black">
            SELLER / SENDER
          </div>

          <div className="mt-2 text-lg font-black">
            {
              sender.businessName ??
              sender.name ??
              "Customer"
            }
          </div>

          <div className="mt-2 text-sm leading-6">
            {sender.address}
            <br />
            {sender.city}
            {" "}
            {sender.pinCode}
          </div>

        </div>


        <div className="p-5">

          <div className="text-xs font-black">
            RECEIVER
          </div>

          <div className="mt-2 text-xl font-black">
            {receiver.name}
          </div>

          <div className="mt-2 text-sm leading-6">
            {receiver.address}
            <br />
            {receiver.city}
            {" "}
            {receiver.pinCode}
          </div>

        </div>

      </div>


      <div className="grid grid-cols-3 border-x-4 border-b-4 border-black">

        <Box
          label="RECEIVING HUB"
          value={
            destinationCode
          }
        />

        <Box
          label="EXPECTED DELIVERY"
          value={
            new Date(
              data.expectedDeliveryAt,
            ).toLocaleDateString(
              "en-IN",
              {
                day:
                  "2-digit",

                month:
                  "short",
              },
            )
          }
        />

        <Box
          label="SERVICE"
          value={
            shipment.serviceType
          }
          last
        />

      </div>


      <div className="grid grid-cols-2 border-x-4 border-b-4 border-black">

        <div className="border-r-2 border-black p-5">

          <div className="text-xs font-black">
            PAYMENT
          </div>

          <div className="mt-1 text-2xl font-black">
            {data.payment.method}
          </div>

        </div>

        <div className="p-5">

          <div className="text-xs font-black">
            {
              data.payment.method ===
              "COD"
                ? "AMOUNT TO COLLECT"
                : "PAYMENT STATUS"
            }
          </div>

          <div className="mt-1 text-2xl font-black">
            {
              data.payment.method ===
              "COD"
                ? `₹${Number(
                    data.payment.amountToCollect,
                  ).toLocaleString(
                    "en-IN",
                  )}`
                : "PREPAID"
            }
          </div>

        </div>

      </div>


      <div className="mt-4 text-center text-[10px] font-bold text-slate-600">

        Barcode and QR identify the same Gogate Products shipment.
        Authorized hub, rider and truck applications can scan either code.

      </div>

    </main>
  );
}

function Box({
  label,
  value,
  last = false,
}: any) {
  return (
    <div
      className={`p-4 ${
        last
          ? ""
          : "border-r-2 border-black"
      }`}
    >

      <div className="text-[10px] font-black">
        {label}
      </div>

      <div className="mt-1 text-xl font-black">
        {value}
      </div>

    </div>
  );
}