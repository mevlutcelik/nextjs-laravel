import { get } from '@/utlis/request';

export async function middleware(request) {
    const token = await request.cookies.get('token')?.value
    const result = await get({
        endpoint: 'verify-token',
        bearerToken: token,
    })

    if (!result.status && request.nextUrl.pathname !== '/'){
        return Response.redirect(new URL('/', request.url))
    }

    if (result.status && result.role !== 'student' && !request.nextUrl.pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL('/dashboard', request.url))
    }

    if (result.status && result.role === 'student' && !request.nextUrl.pathname.startsWith('/panel')) {
        return Response.redirect(new URL('/panel', request.url))
    }

}

export const config = {
    matcher: [
        '/',
        '/dashboard',
        '/panel',
    ],
}