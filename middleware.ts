import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip maintenance check for admin routes and API routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  try {
    // Check maintenance mode from settings
    const settingsResponse = await fetch(`${request.nextUrl.origin}/api/admin/settings`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'E-Queue-Middleware/1.0',
      },
    })

    if (settingsResponse.ok) {
      const settings = await settingsResponse.json()
      
      if (settings?.success && settings.data?.maintenanceMode) {
        // Redirect to maintenance page
        const maintenanceUrl = new URL('/maintenance', request.url)
        return NextResponse.redirect(maintenanceUrl)
      }
    }
  } catch (error) {
    // If we can't check settings, continue normally
    console.warn('Failed to check maintenance mode:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
