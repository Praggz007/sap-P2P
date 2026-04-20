import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { NotificationProvider } from "@/components/NotificationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SAP P2P Management System",
  description: "Procure-to-Pay Simulation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f1ff_0,#f5f7fb_34%,#eef2f7_100%)]">
            <Sidebar />
            <main className="flex-1 pb-20 md:ml-72 md:pb-8 p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
