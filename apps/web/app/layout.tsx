import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Rolefit",
	description: "Save time and money with AI-powered candidate screening",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${workSans.className}`}>{children}</body>
		</html>
	);
}
