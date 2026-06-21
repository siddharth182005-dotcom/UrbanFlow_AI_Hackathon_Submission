import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SidebarNavigation from "@/components/SidebarNavigation";
import TopNav from "@/components/TopNav";
import CopilotWidget from "@/components/CopilotWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UrbanFlow AI - Gridlock Sentinel",
  description: "AI-driven parking intelligence and congestion mitigation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                fetch('/api/log', { method: 'POST', body: JSON.stringify({ type: 'error', message: e.message, filename: e.filename, lineno: e.lineno }) });
              });
              window.addEventListener('unhandledrejection', function(e) {
                fetch('/api/log', { method: 'POST', body: JSON.stringify({ type: 'unhandledrejection', message: e.reason ? e.reason.toString() : 'Unknown' }) });
              });
              const originalError = console.error;
              console.error = function(...args) {
                fetch('/api/log', { method: 'POST', body: JSON.stringify({ type: 'console.error', args: args.map(a => a?.toString()) }) });
                originalError.apply(console, args);
              };
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <SidebarNavigation />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <TopNav />
            <main className="p-6 bg-slate-900 min-h-screen">
              {children}
            </main>
          </div>
        </div>
        <CopilotWidget />
      </body>
    </html>
  );
}
