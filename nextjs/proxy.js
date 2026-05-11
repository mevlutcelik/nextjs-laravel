import { NextResponse } from 'next/server';
import { get } from '@/lib/api';

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // 1. Statik dosyaları ve API rotalarını anında geç
    if (
        pathname.startsWith('/_next') || 
        pathname.startsWith('/static') || 
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const isAuthPage = pathname === '/' || pathname === '/register';

    // 2. Token YOKSA: Sadece login/register'a izin ver
    if (!token) {
        if (isAuthPage) return NextResponse.next();
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        // 3. Token VARSA: Kendi API fonksiyonun ile doğrula
        const result = await get({
            endpoint: 'auth/verify-token',
            bearerToken: token,
        });

        // 4. Token GEÇERSİZSE veya API hata döndürdüyse
        if (!result || !result.status) {
            // DÖNGÜ KIRICI: Zaten '/' sayfasındaysa tekrar '/' sayfasına yönlendirme!
            if (isAuthPage) {
                const response = NextResponse.next();
                response.cookies.delete('token');
                return response;
            } else {
                const response = NextResponse.redirect(new URL('/', request.url));
                response.cookies.delete('token');
                return response;
            }
        }

        // 5. Token GEÇERLİYSE: Rolleri al
        const userRole = result.role;

        // Giriş yapmış birisi '/' veya '/register' sayfasına gelirse:
        if (isAuthPage) {
            const targetPath = userRole === 'student' ? '/panel' : '/dashboard';
            return NextResponse.redirect(new URL(targetPath, request.url));
        }

        // Yanlış panelde ise doğru panele yönlendir
        if (userRole === 'student' && pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/panel', request.url));
        } 
        
        if (userRole !== 'student' && pathname.startsWith('/panel')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Her şey yolundaysa isteğin geçmesine izin ver
        return NextResponse.next();

    } catch (error) {
        console.error("Proxy Hatası:", error.message);
        
        // Sunucu bağlantısı koparsa veya beklenmedik bir hata olursa:
        if (isAuthPage) {
            const response = NextResponse.next();
            response.cookies.delete('token');
            return response;
        } else {
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('token');
            return response;
        }
    }
}

// 6. Matcher
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};