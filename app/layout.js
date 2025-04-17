import Navbar from "@/app/components/Navbar";
import "./globals.css"

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>S-Toller the way and the desire to generate story.</title>
            </head>
            <body className="h-screen">
                <drk className="__drk __main_entry">
                    <Navbar />
                    {children}
                </drk>
            </body>
        </html>
    );
}
