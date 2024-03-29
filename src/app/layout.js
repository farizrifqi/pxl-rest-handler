import { Inter } from "next/font/google";
import "./globals.css";
import SocketContextProvider from "@/components/Context/IOSocket";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PXL",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          rel="stylesheet"
        ></link>
      </head>
      <body className={inter.className}><SocketContextProvider>{children}</SocketContextProvider></body>
    </html>
  );
}
