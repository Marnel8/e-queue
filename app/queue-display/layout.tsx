import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Queue Display - E-Queue System",
  description: "Real-time queue display for customers and staff monitoring",
};

export default function QueueDisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

