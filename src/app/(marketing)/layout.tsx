'use client'

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { FirebaseClientProvider } from "@/firebase";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
    </FirebaseClientProvider>
  );
}
