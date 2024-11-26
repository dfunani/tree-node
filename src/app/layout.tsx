// in app/layout.tsx

import { getServerSession } from "next-auth"
import Providers from "./providers"
import "@/src/app/globals.css"

// THIS WILL WORK

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession()

    return (
        <html lang="en">
            <body>
                <Providers session={session}>
                    {children}
                </Providers>
            </body>
        </html>
    )
}