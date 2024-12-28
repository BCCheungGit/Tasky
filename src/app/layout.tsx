import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Provider } from "./provider";
const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Task Management App",
  description: "Benjamin Cheung bc3431",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
      <Provider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
