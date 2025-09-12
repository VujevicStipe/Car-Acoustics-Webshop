"use client";

import { usePathname } from "next/navigation";
import NavBar from "./nav-bar/NavBar";
import FooterComponent from "./footer/FooterComponent";
import "../../styles/globals.css";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const segments = pathname.split("/");
  const isAdminRoute = segments[2] === "admin";

  return (
    <>
      {!isAdminRoute && (
        <header className="headerStyles">
          <nav className="navStyles">
            <NavBar />
          </nav>
        </header>
      )}
      {children}
      {!isAdminRoute && (
        <footer className="footerStyles">
          <FooterComponent />
        </footer>
      )}
    </>
  );
}
