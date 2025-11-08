import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NordMatch - AI-Powered ATS Platform",
  description: "Recruitment tracking system for modern teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}