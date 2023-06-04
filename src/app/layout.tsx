import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Faker: JSON Placeholder",
  description:
    "Unleash your creativity with our JSON generator. Easily generate custom JSON objects based on your specified type, empowering you to bring your data to life. Create JSON examples effortlessly, regardless of the programming language you use.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
