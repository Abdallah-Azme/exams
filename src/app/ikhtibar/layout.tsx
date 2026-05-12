import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-ikhtibar",
  display: "swap",
});

export default function IkhtibarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${tajawal.variable} bg-white font-[family-name:var(--font-ikhtibar)] text-[#4A4A4A] antialiased`}
    >
      {children}
    </div>
  );
}
