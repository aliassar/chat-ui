import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Doodle Chat",
    description: "A simple chat interface for the Doodle frontend challenge",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${openSans.variable} h-full`}>
            <body className="min-h-full flex flex-col font-[family-name:var(--font-open-sans)]">
                {children}
            </body>
        </html>
    );
}
