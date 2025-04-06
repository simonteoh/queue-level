// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { jwtVerify } from 'jose';  // Using jose instead of jsonwebtoken

// // Paths that don't require authentication
// const publicPaths = ['/login'];

// // Paths that require admin role only
// const adminPaths = ['/roles'];

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;
//   const path = request.nextUrl.pathname;
//   console.log("MIDDLEWARE PATH:", path);

//   // Allow public paths
//   if (publicPaths.includes(path)) {
//     return NextResponse.next();
//   }

//   // Check if user is authenticated
//   if (!token) {
//     console.log("NO TOKEN")
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   try {
//     // Verify token using jose
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);
//     const decoded = payload as { role: string };

//     // Check if user has admin role for admin-only paths
//     if (adminPaths.some(p => path.startsWith(p)) && decoded.role !== 'admin') {
//       // Redirect non-admin users to dashboard
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.log("MIDDLEWARE ERROR:", error)
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// } 