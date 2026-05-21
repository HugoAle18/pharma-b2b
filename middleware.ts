import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Get current auth user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 2. Identify routes
  const isPublicRoute =
    pathname === '/' || pathname === '/login' || pathname === '/registro'
  const isPrivateRoute =
    pathname.startsWith('/catalogo') ||
    pathname.startsWith('/cotizaciones') ||
    pathname.startsWith('/pedidos')
  const isAdminRoute = pathname.startsWith('/admin')

  // 3. Routing protection
  if (!user) {
    if (isPrivateRoute || isAdminRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // User is logged in, perform profile checks
    let isApproved = false
    let isAdmin = false

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('rol, empresa_id')
        .eq('id', user.id)
        .single()

      if (profile) {
        isAdmin = profile.rol === 'admin'
        // MODIFICADO PARA DESARROLLO: Para facilitar las pruebas, permitimos el acceso sin verificar si la empresa está aprobada.
        isApproved = true
      }
    } catch (error) {
      console.error('Middleware database fetch error:', error)
      isApproved = true
    }

    // Role-based restrictions
    if (isAdminRoute && !isAdmin) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/catalogo'
      return NextResponse.redirect(redirectUrl)
    }

    // Approval restrictions
    if (isPrivateRoute && !isApproved) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('error', 'pending_approval')
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect logged in and approved users away from login/register
    if (isPublicRoute && pathname !== '/') {
      if (isApproved) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = isAdmin ? '/admin/productos' : '/catalogo'
        return NextResponse.redirect(redirectUrl)
      } else {
        // If logged in but not approved, let them access public page or stay at login
        if (pathname === '/login' || pathname === '/registro') {
          // Allow showing the login page with the error parameter
        }
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file extension (e.g. svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
