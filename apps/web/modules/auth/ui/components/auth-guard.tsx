'use client'

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { AuthLayout } from "../layouts/auth-layout"
import SignInView from "../views/sign-in-view"
import { LoaderFive, LoaderFour } from "@/components/ui/loader"


export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AuthLoading>
                <AuthLayout>
                    <LoaderFive text="Loading..." />
                </AuthLayout>
            </AuthLoading>
            <Authenticated>
                {children}
            </Authenticated>
            <Unauthenticated>
                <SignInView />
            </Unauthenticated>
        </>
    )
}