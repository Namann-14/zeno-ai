"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ConvexReactClient } from "convex/react"
import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";


if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
      forcedTheme="light"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </NextThemesProvider>
  )
}
