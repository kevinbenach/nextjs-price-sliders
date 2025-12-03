import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Range Component - MANGO Technical Test',
  description: 'Custom Range component implementation for MANGO frontend technical test',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
