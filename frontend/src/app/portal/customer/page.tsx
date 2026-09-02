"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Boxes,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  Headphones,
  MapPin,
  Navigation,
  PackageCheck,
  PackagePlus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  WalletCards,
} from "lucide-react";
import { CustomerApi } from "@/lib/customer-api";

type Shipment = {
  id: string;
  awb: string;
  status?: string;
  serviceType?: string;
  expectedDeliveryAt?: string;
  updatedAt?: string;
  origin?: string;
  destination?: string;
};

type DashboardData = {
  customer?: { email?: string; phone?: string };
  stats?: Record<string, number>;
  recentShipments?: Shipment[];
};

export default function Page() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");

  function loadDashboard() {
    setError("");
    CustomerApi.dashboard()
      .then(setData)
      .catch((requestError: Error) => setError(requestError.message));
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = data?.stats ?? {};
  const shipments = data?.recentShipments ?? [];
  const customer = data?.customer ?? {};
  const displayName = customer.email
    ? customer.email.split("@")[0].replace(/[._-]/g, " ")
    : customer.phone
      ? `Customer ${customer.phone.slice(-4)}`
      : "Customer";
  const activeShipment = useMemo(
    () => shipments.find((shipment) => !isDelivered(shipment.status)),
    [shipments],
  );

  return (
    <div className="mx-auto max-w-7xl pb-10">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,.16)] sm:px-9 sm:py-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-sky-300">
              <Sparkles size={15} /> Customer command center
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
              Good morning, {displayName}.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Every shipment, payment and delivery milestone in one clear workspace.
              Hyperlocal orders show live rider movement only while they are actively in transit.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/portal/customer/shipments/new" className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-300">
                <PackagePlus size={17} /> Send a package
              </Link>
              <Link href="/track" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15">
                <Search size={17} /> Track a shipment
              </Link>
            </div>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Quick tracking</div>
                <div className="mt-2 text-lg font-black">Where is your shipment?</div>
              </div>
              <Navigation className="text-sky-300" size={24} />
            </div>
            <form className="mt-5 flex gap-2" onSubmit={(event) => event.preventDefault()}>
              <input value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder="Enter AWB or shipment ID" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300" />
              <Link href={trackingId.trim() ? `/track?awb=${encodeURIComponent(trackingId.trim())}` : "/track"} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-slate-950 transition hover:bg-sky-200" aria-label="Track shipment">
                <ArrowRight size={18} />
              </Link>
            </form>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400"><ShieldCheck size={14} className="text-emerald-300" /> Secure, customer-safe tracking</div>
          </div>
        </div>
      </section>

      {error && <div className="mt-5 flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"><span>{error}</span><button onClick={loadDashboard} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs"><RefreshCw size={14} /> Retry</button></div>}

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Box} value={stats.total ?? 0} label="Total shipments" tone="sky" />
        <Metric icon={Truck} value={stats.active ?? 0} label="In progress" tone="violet" />
        <Metric icon={CheckCircle2} value={stats.delivered ?? 0} label="Delivered safely" tone="emerald" />
        <Metric icon={CircleAlert} value={stats.exceptions ?? 0} label="Needs attention" tone="amber" />
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,.04)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><div className="text-xs font-black uppercase tracking-[.18em] text-sky-600">Live delivery overview</div><h2 className="mt-2 text-2xl font-black text-slate-900">Your next delivery</h2></div>
            {activeShipment ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">{activeShipment.serviceType === "HYPERLOCAL" ? "Live hyperlocal" : "In transit"}</span> : null}
          </div>
          {activeShipment ? <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-center"><div><div className="text-2xl font-black tracking-wide text-sky-700">{activeShipment.awb}</div><div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500"><span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {activeShipment.origin ?? "Pickup location"}</span><ArrowRight size={15} className="text-slate-300" /><span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {activeShipment.destination ?? "Delivery location"}</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" /></div><div className="mt-2 flex justify-between text-[11px] font-bold text-slate-400"><span>Picked up</span><span>In transit</span><span>Delivered</span></div></div><div className="grid h-24 w-24 place-items-center rounded-3xl bg-sky-50 text-sky-600"><Clock3 size={30} /><div className="-mt-5 text-[10px] font-black">ETA soon</div></div></div> : <div className="mt-7 rounded-3xl bg-slate-50 p-7 text-center"><PackageCheck className="mx-auto text-sky-500" size={34} /><div className="mt-3 font-black text-slate-900">No active deliveries</div><p className="mt-1 text-sm text-slate-500">Send a package and follow every milestone from pickup to proof of delivery.</p></div>}
          {activeShipment && <div className="mt-6 flex flex-wrap gap-3"><Link href={`/track?awb=${encodeURIComponent(activeShipment.awb)}`} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black text-white"><Navigation size={15} /> Open live tracking</Link><Link href={`/portal/customer/shipments/${encodeURIComponent(activeShipment.awb)}/label`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-700"><FileText size={15} /> Shipping label</Link></div>}
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-sky-50 to-emerald-50 p-5 sm:p-6"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-600 shadow-sm"><Boxes size={22} /></div><h2 className="mt-5 text-xl font-black text-slate-900">One shipment workspace</h2><p className="mt-2 text-sm leading-6 text-slate-600">Labels, invoices, payment receipts and support are attached to the same shipment record.</p><div className="mt-6 space-y-3 text-sm font-bold text-slate-700"><Feature text="Amazon-style milestone timeline" /><Feature text="Hyperlocal route and rider ETA" /><Feature text="Invoice and label downloads" /></div></div>
      </section>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Action href="/portal/customer/shipments/new" icon={PackagePlus} title="Send a package" text="Courier or hyperlocal" />
        <Action href="/portal/customer/addresses" icon={MapPin} title="Saved addresses" text={`${stats.addresses ?? 0} pickup and drop points`} />
        <Action href="/portal/customer/payments" icon={WalletCards} title="Payments" text="Receipts and preferences" />
        <Action href="/portal/customer/support" icon={Headphones} title="Customer care" text={`${stats.openTickets ?? 0} open conversations`} />
      </section>

      <section className="mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,.04)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6"><div><div className="text-xs font-black uppercase tracking-[.18em] text-slate-400">Shipment history</div><h2 className="mt-1 text-xl font-black text-slate-900">Recent shipments</h2></div><Link href="/portal/customer/shipments" className="inline-flex items-center gap-1 text-xs font-black text-sky-700">View all <ArrowUpRight size={14} /></Link></div>{shipments.length === 0 ? <div className="p-12 text-center"><Box size={34} className="mx-auto text-sky-500" /><div className="mt-4 font-black">No shipments yet</div><Link href="/portal/customer/shipments/new" className="mt-4 inline-block rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white">Send your first package</Link></div> : <div className="divide-y divide-slate-100">{shipments.slice(0, 6).map((shipment) => <div key={shipment.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><div><Link href={`/track?awb=${encodeURIComponent(shipment.awb)}`} className="text-lg font-black tracking-wide text-sky-700 hover:underline">{shipment.awb}</Link><div className="mt-1 flex flex-wrap gap-3 text-xs font-bold text-slate-400"><span>{shipment.serviceType ?? "NORMAL"}</span><span>{shipment.updatedAt ? formatDate(shipment.updatedAt) : "Recently updated"}</span></div></div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${isDelivered(shipment.status) ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>{shipment.status ?? "CREATED"}</span><Link href={`/portal/customer/shipments/${encodeURIComponent(shipment.awb)}/invoice`} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:text-sky-600" title="Invoice"><FileText size={16} /></Link><Link href={`/portal/customer/shipments/${encodeURIComponent(shipment.awb)}/label`} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:text-sky-600" title="Label"><PackageCheck size={16} /></Link></div></div>)}</div>}</section>
    </div>
  );
}

function isDelivered(status?: string) { return ["DELIVERED", "DELIVERY_CONFIRMED"].includes(status ?? ""); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(value)); }
function Feature({ text }: { text: string }) { return <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" />{text}</div>; }
function Metric({ icon: Icon, value, label, tone }: { icon: typeof Box; value: number; label: string; tone: "sky" | "violet" | "emerald" | "amber" }) { const colors = { sky: "bg-sky-50 text-sky-600", violet: "bg-violet-50 text-violet-600", emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600" }; return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,.04)]"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${colors[tone]}`}><Icon size={20} /></div><div className="mt-5 text-3xl font-black text-slate-900">{value}</div><div className="mt-1 text-sm font-bold text-slate-500">{label}</div></div>; }
function Action({ href, icon: Icon, title, text }: { href: string; icon: typeof Box; title: string; text: string }) { return <Link href={href} className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"><Icon className="text-sky-600" size={23} /><div className="mt-4 font-black text-slate-900">{title}</div><div className="mt-1 text-xs text-slate-500">{text}</div><ArrowUpRight className="mt-4 text-slate-300 transition group-hover:text-sky-600" size={16} /></Link>; }
