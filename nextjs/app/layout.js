import {ThemeProvider} from "@/components/theme/theme-provider";
import CustomNextLoader from "@/components/CustomNextLoader";
import { Toaster } from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
// import {Figtree} from "next/font/google";
import {Montserrat} from "next/font/google";
import {Zilla_Slab} from "next/font/google";
import "./globals.css";

const font = Montserrat({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const font2 = Zilla_Slab({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const metadata = {
    title: "Bestjobsgermany",
    description: "Bestjobsgermany",
};

export default function RootLayout({children}) {
    return (
        <html lang="tr-TR" suppressHydrationWarning>
        <body className={cn('antialiased', font.className)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <CustomNextLoader/>
            {children}
            <Toaster />
        </ThemeProvider>
        </body>
        </html>
    );
}
