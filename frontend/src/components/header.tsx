"use client";

import Link from "next/link";
import { Menu, PackageCheck, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#2563eb] text-slate-900 shadow-lg shadow-blue-500/20">
            <PackageCheck size={21} />
          </span>
          <span>
            GP <span className="text-[#2563eb]">Logistics</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/#services" className="transition hover:text-[#2563eb]">
            Services
          </Link>
          <Link href="/track" className="transition hover:text-[#2563eb]">
            Track shipment
          </Link>
          <Link href="/#why-us" className="transition hover:text-[#2563eb]">
            Why us
          </Link>
          <Link href="/login" className="transition hover:text-[#2563eb]">
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-[#2563eb] px-5 py-2.5 text-slate-900 transition hover:-translate-y-0.5 hover:bg-[#2563eb]"
          >
            Create account
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2 md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4 font-semibold text-slate-700">
            <Link href="/track" onClick={() => setOpen(false)}>Track shipment</Link>
            <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link href="/signup" onClick={() => setOpen(false)}>Create account</Link>
          </div>
        </div>
      )}
    </header>
  );
}
