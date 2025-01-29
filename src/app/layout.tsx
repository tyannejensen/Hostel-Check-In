// These styles apply to every route in the application
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "@/styles/global.css";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <section>{children}</section>
      </body>
    </html>
  );
}
