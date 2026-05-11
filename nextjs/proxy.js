import { get } from '@/lib/api';

export async function proxy(request) {
    const token = request.cookies.get('token')?.value;

    const pathname = request.nextUrl.pathname;

    const isAuthPage = ['/', '/register'].includes(pathname);

    // Token yoksa ve auth sayfasında değilse login'e yönlendir
    if (!token && !isAuthPage) {
        return Response.redirect(new URL('/', request.url));
    }

    // Token varsa doğrula
    if (token) {
        try {
            const result = await get({
                endpoint: 'auth/verify-token',
                bearerToken: token,
            });

            // Token geçersizse
            if (!result.status && !isAuthPage) {
                const response = Response.redirect(new URL('/', request.url));

                response.cookies.delete('token');

                return response;
            }

            // Kullanıcı giriş yapmışsa auth sayfalarını gösterme
            if (result.status && isAuthPage) {
                if (result.role === 'student') {
                    return Response.redirect(new URL('/panel', request.url));
                }

                return Response.redirect(new URL('/dashboard', request.url));
            }

            // Role bazlı erişim
            if (
                result.role !== 'student' &&
                !pathname.startsWith('/dashboard')
            ) {
                return Response.redirect(new URL('/dashboard', request.url));
            }

            if (
                result.role === 'student' &&
                !pathname.startsWith('/panel')
            ) {
                return Response.redirect(new URL('/panel', request.url));
            }

        } catch (error) {
            console.error('Middleware auth error:', error.message);

            if (!isAuthPage) {
                const response = Response.redirect(new URL('/', request.url));

                response.cookies.delete('token');

                return response;
            }
        }
    }
}

export const config = {
    matcher: [
        '/',
        '/register',
        '/dashboard/:path*'
    ],
};