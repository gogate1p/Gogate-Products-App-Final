"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ShieldCheck,
} from "lucide-react";

import {
  accessToken,
  clearPortalSession,
  PortalAuth,
  PortalUser,
} from "@/lib/portal-auth";

const permissions:
  Record<
    string,
    string[]
  > = {
  "/portal/admin": [
    "SUPER_ADMIN",
    "ADMIN",
  ],

  "/portal/hub": [
    "SUPER_ADMIN",
    "ADMIN",
    "OPERATIONS_MANAGER",
    "REGIONAL_MANAGER",
    "HUB_MANAGER",
    "HUB_PERSONNEL",
    "DISPATCHER",
  ],

  "/portal/branch": [
    "SUPER_ADMIN",
    "ADMIN",
    "OPERATIONS_MANAGER",
    "REGIONAL_MANAGER",
    "BRANCH_MANAGER",
    "BRANCH_STAFF",
    "BOOKING_AGENT",
  ],

  "/portal/dispatcher": [
    "SUPER_ADMIN",
    "ADMIN",
    "OPERATIONS_MANAGER",
    "REGIONAL_MANAGER",
    "DISPATCHER",
    "FLEET_MANAGER",
  ],

  "/portal/wms": [
    "SUPER_ADMIN",
    "ADMIN",
    "OPERATIONS_MANAGER",
    "HUB_MANAGER",
    "HUB_PERSONNEL",
  ],

  "/portal/support": [
    "SUPER_ADMIN",
    "ADMIN",
    "SUPPORT",
  ],

  "/portal/staff": [
    "SUPER_ADMIN",
    "ADMIN",
    "FINANCE",
  ],

  "/portal/merchant": [
    "SUPER_ADMIN",
    "ADMIN",
    "MERCHANT",
  ],

  "/portal/shipper": [
    "SUPER_ADMIN",
    "ADMIN",
    "SHIPPER",
  ],

  "/portal/customer": [
    "SUPER_ADMIN",
    "ADMIN",
    "CUSTOMER",
  ],
};

function allowed(
  pathname: string,
  role: string,
) {
  const match =
    Object.keys(
      permissions,
    )
      .sort(
        (a, b) =>
          b.length -
          a.length,
      )
      .find(
        prefix =>
          pathname ===
            prefix ||
          pathname.startsWith(
            `${prefix}/`,
          ),
      );

  if (!match) {
    return true;
  }

  return permissions[
    match
  ].includes(role);
}

export default function PortalAuthGate({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    checking,
    setChecking,
  ] =
    useState(true);

  const [
    user,
    setUser,
  ] =
    useState<
      PortalUser | null
    >(null);

  useEffect(
    () => {
      async function check() {
        /*
         * Login pages must remain public.
         */
        if (
          pathname ===
            "/portal/login" ||
          pathname.endsWith(
            "/login",
          )
        ) {
          setChecking(false);
          return;
        }

        if (!accessToken()) {
          router.replace(
            "/portal/login",
          );

          return;
        }

        try {
          const me =
            await PortalAuth.me();

          setUser(me);

          if (
            me.mustChangePassword &&
            pathname !==
              "/portal/change-password"
          ) {
            router.replace(
              "/portal/change-password",
            );

            return;
          }

          /*
           * Merchant / shipper KYC gate.
           */
          if (
            me.role ===
              "MERCHANT" &&
            me.status !==
              "ACTIVE" &&
            pathname !==
              "/portal/merchant/kyc"
          ) {
            router.replace(
              "/portal/merchant/kyc",
            );

            return;
          }

          if (
            me.role ===
              "SHIPPER" &&
            me.status !==
              "ACTIVE" &&
            pathname !==
              "/portal/shipper/kyc"
          ) {
            router.replace(
              "/portal/shipper/kyc",
            );

            return;
          }

          if (
            !allowed(
              pathname,
              me.role,
            )
          ) {
            router.replace(
              me.redirectTo ??
              "/",
            );

            return;
          }

          setChecking(
            false,
          );
        } catch {
          clearPortalSession();

          router.replace(
            "/portal/login",
          );
        }
      }

      check();
    },
    [
      pathname,
      router,
    ],
  );

  if (
    pathname ===
      "/portal/login" ||
    pathname.endsWith(
      "/login",
    )
  ) {
    return children;
  }

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-sky-50 via-white to-emerald-50">

        <div className="text-center">

          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
            <ShieldCheck
              size={27}
            />
          </div>

          <div className="mt-4 font-black text-slate-800">
            Gogate Products
          </div>

          <div className="mt-1 text-sm font-bold text-slate-400">
            Verifying secure access...
          </div>

        </div>

      </main>
    );
  }

  return children;
}