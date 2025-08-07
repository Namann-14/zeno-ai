import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

const isOrganizationFreeRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/org-selection(.*)",
  "/", // Add root route to organization-free routes
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, orgId } = await auth();
  
  // First, protect non-public routes (require authentication)
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  
  // If user is authenticated but has no organization, redirect to org-selection
  // except for routes that don't require organization
  if (userId && !orgId && !isOrganizationFreeRoute(request)) {
    const searchParams = new URLSearchParams({ redirectUrl: request.url });
    const orgSelection = new URL(
      `/org-selection?${searchParams.toString()}`,
      request.url
    );

    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
