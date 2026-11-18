import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mambanda Market Delivery & Carrier Management Platform",
  description: "Manage delivery clients, multi-carrier quotes, delivery agents, and reconciliation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-[#07080f] text-[#f4f6ef] font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-[#252839] text-xs text-[#8b90a3] py-4 px-6 text-center lg:text-left bg-[#11131e]/50">
            Mambanda Market Delivery & Carrier Platform • Integrated with Carrier-Platform & Core API Reconciliation v1.0
          </footer>
        </div>
      </body>
    </html>
  );
}
