import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // For admin routes, we'll handle authentication on the client side
  // since we're using localStorage for the demo authentication system

  // Allow all requests to pass through
  // Authentication will be handled by individual page components
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
