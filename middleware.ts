import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/'])

export default clerkMiddleware((auth, req) => {
  // Avoid loops by checking for existing redirects
  const currentUrl = req.nextUrl;
  const redirectUrl = currentUrl.searchParams.get("redirect_url");

  if (redirectUrl && redirectUrl.includes("sign-in")) {
    return NextResponse.next();
  }

  if (auth().userId && isPublicRoute(req)) {
    let path = "/select-org";

    if (auth().orgId) {
      path = `/organization/${auth().orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!auth().userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn();
  }

  if (auth().userId && !auth().orgId && req.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelection);
  }
}, { debug: true });


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}