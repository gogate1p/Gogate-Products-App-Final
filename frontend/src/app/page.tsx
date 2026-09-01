"use client";

import Link from "next/link";

import {
  ArrowRight,
  Bike,
  Boxes,
  Building2,
  CheckCircle2,
  Globe2,
  Headphones,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Warehouse,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#159447] text-white shadow-sm">
              <PackageCheck size={21} />
            </div>

            <div>

              <div className="text-lg font-black tracking-tight">
                Gogate Products
              </div>

              <div className="text-[10px] font-black uppercase tracking-[.15em] text-slate-400">
                Logistics
              </div>

            </div>

          </Link>


          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">

            <a href="#services">
              Services
            </a>

            <a href="#business">
              Business
            </a>

            <a href="#technology">
              Technology
            </a>

            <Link href="/track">
              Track
            </Link>

          </nav>


          <div className="flex items-center gap-2">

            <Link
              href="/portal/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-[#159447] px-4 py-2.5 text-sm font-black text-white shadow-[0_8px_22px_rgba(21,148,71,.18)]"
            >
              Get started
            </Link>

          </div>

        </div>

      </header>


      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(21,148,71,.08),transparent_30rem),radial-gradient(circle_at_90%_0%,rgba(14,165,233,.07),transparent_28rem)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:py-28">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black text-[#159447]">

              <Globe2 size={15} />

              Logistics built for modern commerce

            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.04] tracking-[-.045em] sm:text-6xl xl:text-7xl">

              Deliver every shipment with

              <span className="text-[#159447]">
                {" "}clarity and control.
              </span>

            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">

              Courier, hyperlocal delivery, fulfilment and logistics operations for individuals, merchants and businesses across one connected platform.

            </p>


            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#159447] px-6 py-4 font-black text-white shadow-[0_16px_35px_rgba(21,148,71,.20)] transition hover:-translate-y-0.5"
              >
                Create account
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/track"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-700"
              >
                <Search size={18} />
                Track shipment
              </Link>

            </div>


            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-slate-500">

              <span className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="text-[#159447]"
                />
                12-digit shipment IDs
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="text-[#159447]"
                />
                End-to-end visibility
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="text-[#159447]"
                />
                Secure delivery verification
              </span>

            </div>

          </div>


          <div className="relative">

            <div className="rounded-[34px] border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-[0_30px_85px_rgba(15,23,42,.08)] sm:p-8">

              <div className="rounded-[26px] border border-white bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="text-xs font-black uppercase tracking-[.15em] text-slate-400">
                      Logistics Services
                    </div>

                    <div className="mt-1 text-xl font-black">
                      One platform. Multiple delivery modes.
                    </div>

                  </div>

                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-[#159447]">
                    <Truck size={22} />
                  </div>

                </div>


                <div className="mt-7 grid gap-3 sm:grid-cols-2">

                  <ServiceMini
                    icon={PackageCheck}
                    title="Courier"
                    text="Standard parcel delivery"
                  />

                  <ServiceMini
                    icon={Bike}
                    title="Hyperlocal"
                    text="Fast city delivery"
                  />

                  <ServiceMini
                    icon={Warehouse}
                    title="Warehousing"
                    text="Inventory and fulfilment"
                  />

                  <ServiceMini
                    icon={Boxes}
                    title="Enterprise"
                    text="High-volume logistics"
                  />

                </div>

              </div>


              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <div className="rounded-[24px] bg-[#159447] p-5 text-white">

                  <ShieldCheck size={22} />

                  <div className="mt-4 font-black">
                    Secure operations
                  </div>

                  <div className="mt-1 text-xs leading-5 text-white/75">
                    Scan-based handling, OTP verification and shipment audit trails.
                  </div>

                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5">

                  <Headphones
                    size={22}
                    className="text-[#159447]"
                  />

                  <div className="mt-4 font-black">
                    Customer care
                  </div>

                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Shipment-linked support and service requests.
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      <section
        id="services"
        className="border-y border-slate-100 bg-[#f8faf9]"
      >

        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

          <div className="max-w-2xl">

            <div className="text-xs font-black uppercase tracking-[.18em] text-[#159447]">
              Our Services
            </div>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Logistics for every kind of shipment.
            </h2>

          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <Service
              icon={Truck}
              title="Domestic Courier"
              text="Reliable parcel movement through Gogate Products' courier network."
            />

            <Service
              icon={Bike}
              title="Hyperlocal"
              text="Fast intra-city pickup and delivery for urgent local requirements."
            />

            <Service
              icon={ShoppingBag}
              title="E-commerce Logistics"
              text="Shipping, COD, fulfilment and returns for online sellers."
            />

            <Service
              icon={Warehouse}
              title="Warehousing"
              text="Inventory, processing, dispatch and fulfilment operations."
            />

          </div>

        </div>

      </section>


      <section
        id="business"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
      >

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-[34px] bg-[#effbf3] p-8 sm:p-10">

            <Building2
              size={29}
              className="text-[#159447]"
            />

            <h3 className="mt-6 text-3xl font-black">
              Built for merchants and shippers
            </h3>

            <p className="mt-4 leading-7 text-slate-500">
              Manage orders, pickups, shipment history, labels, invoices, COD and delivery performance from one workspace.
            </p>

            <Link
              href="/signup"
              className="mt-7 inline-flex items-center gap-2 font-black text-[#159447]"
            >
              Open a business account
              <ArrowRight size={17} />
            </Link>

          </div>


          <div
            id="technology"
            className="rounded-[34px] border border-slate-200 bg-white p-8 sm:p-10"
          >

            <ShieldCheck
              size={29}
              className="text-[#159447]"
            />

            <h3 className="mt-6 text-3xl font-black">
              Connected shipment intelligence
            </h3>

            <p className="mt-4 leading-7 text-slate-500">
              Barcode and QR scans create an auditable shipment journey across pickup, hubs, line-haul transport and last-mile delivery.
            </p>

            <Link
              href="/track"
              className="mt-7 inline-flex items-center gap-2 font-black text-[#159447]"
            >
              Track a shipment
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>


      <footer className="border-t border-slate-200 bg-[#f8faf9]">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>

            <div className="font-black">
              Gogate Products
            </div>

            <div className="mt-1 text-xs text-slate-400">
              Modern logistics and fulfilment.
            </div>

          </div>

          <div className="flex gap-5 text-sm font-bold text-slate-500">

            <Link href="/track">
              Tracking
            </Link>

            <Link href="/portal/login">
              Sign in
            </Link>

            <Link href="/signup">
              Create account
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}

function ServiceMini({
  icon: Icon,
  title,
  text,
}: any) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <Icon
        size={19}
        className="text-[#159447]"
      />

      <div className="mt-3 text-sm font-black">
        {title}
      </div>

      <div className="mt-1 text-[11px] text-slate-500">
        {text}
      </div>

    </div>
  );
}

function Service({
  icon: Icon,
  title,
  text,
}: any) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,.07)]">

      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-[#159447]">
        <Icon size={23} />
      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}