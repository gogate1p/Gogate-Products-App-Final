import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gogate Products | Logistics & Fulfilment",
  description:
    "Modern logistics, warehousing, fulfilment, shipment tracking and delivery operations by Gogate Products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}