import { get } from '@/lib/api';

export async function middleware(request) {
    const token = await request.cookies.get('token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/';
    
    // Token yoksa ve login sayfasında değilse login'e yönlendir
    if (!token && !isLoginPage) {
        return Response.redirect(new URL('/', request.url));
    }

    // Token varsa doğrula
    if (token) {
        try {
            const result = await get({
                endpoint: 'auth/verify-token',
                bearerToken: token,
            });

            // Token geçersizse veya status false ise login'e yönlendir
            if (!result.status && !isLoginPage) {
                const response = Response.redirect(new URL('/', request.url));
                // Cookie'yi temizle
                response.cookies.delete('token');
                return response;
            }

            // Rol bazlı yönlendirme (kullanıcı giriş yapmışsa)
            if (result.status) {
                // Login sayfasındaysa dashboarda yönlendir
                if (isLoginPage) {
                    if (result.role === 'student') {
                        return Response.redirect(new URL('/panel', request.url));
                    } else {
                        return Response.redirect(new URL('/dashboard', request.url));
                    }
                }

                // Dashboard/Panel kontrolü
                if (result.role !== 'student' && !request.nextUrl.pathname.startsWith('/dashboard')) {
                    return Response.redirect(new URL('/dashboard', request.url));
                }

                if (result.role === 'student' && !request.nextUrl.pathname.startsWith('/panel')) {
                    return Response.redirect(new URL('/panel', request.url));
                }
            }

        } catch (error) {
            // API hatası durumunda (401, 403, vb.) login'e yönlendir
            console.error('Middleware auth error:', error.message);
            if (!isLoginPage) {
                const response = Response.redirect(new URL('/', request.url));
                // Cookie'yi temizle
                response.cookies.delete('token');
                return response;
            }
        }
    }
}

export const config = {
    matcher: [
        '/',
        '/dashboard',
        '/panel',
    ],
}