import "./globals.css";
export const metadata = { title: process.env.SITE_NAME || "CMS" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /></head><body className="font-sans antialiased">{children}</body></html>);
}
