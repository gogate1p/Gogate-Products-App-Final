import PortalAuthGate from "@/components/portal-auth-gate";

export default function PortalLayout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <PortalAuthGate>
      {children}
    </PortalAuthGate>
  );
}