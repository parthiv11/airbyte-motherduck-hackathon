import { MotherDuckClientProvider } from "@/lib/motherduck/context/motherduckClientContext";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";

export const metadata = {
  metadataBase: new URL("https://airbyte-motherduck-hackathon.vercel.app/"),
  title: "Natural Language MotherDuck",
  description:
    "Chat with a MotherDuck database using natural language powered by the AI SDK by Vercel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistMono.className} ${GeistSans.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MotherDuckClientProvider >
            {children}
          </MotherDuckClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
