"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  CreditCard,
  Headphones,
  Home,
  LogOut,
  MapPinned,
  PackagePlus,
  PackageSearch,
} from "lucide-react";

import {
  PortalAuth,
} from "@/lib/portal-auth";

const navigation = [
  {
    href: "/portal/customer",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/portal/customer/shipments/new",
    label: "Send Package",
    icon: PackagePlus,
  },
  {
    href: "/portal/customer/shipments",
    label: "My Shipments",
    icon: PackageSearch,
  },
  {
    href: "/portal/customer/addresses",
    label: "Addresses",
    icon: MapPinned,
  },
  {
    href: "/portal/customer/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    href: "/portal/customer/support",
    label: "Customer Care",
    icon: Headphones,
  },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  async function logout() {
    await PortalAuth.logout();

    router.replace(
      "/portal/login",
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[265px_1fr]">

        <aside className="hidden border-r border-slate-200 bg-white p-5 lg:block">

          <div className="text-lg font-black text-slate-900">
            Gogate Products
          </div>

          <div className="mt-1 text-xs font-bold text-slate-400">
            Customer Portal
          </div>

          <nav className="mt-8 space-y-1.5">

            {navigation.map(
              item => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                    item.href ||
                  (
                    item.href !==
                      "/portal/customer" &&
                    pathname.startsWith(
                      item.href,
                    )
                  );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                      active
                        ? "bg-[#0284c7] text-white"
                        : "text-slate-600 hover:bg-sky-50"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              },
            )}

          </nav>

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600"
          >
            <LogOut size={18} />
            Sign out
          </button>

        </aside>

        <main className="min-w-0">

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl lg:hidden">

            <div className="font-black">
              Gogate Products
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto">

              {navigation.map(
                item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black"
                  >
                    {item.label}
                  </Link>
                ),
              )}

            </div>

          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}