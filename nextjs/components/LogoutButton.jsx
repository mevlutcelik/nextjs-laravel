"use client";
import {useState} from "react";
import {post} from "@/lib/api";
import useToken from "@/hooks/useToken";
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LogoutButton(){
    const [loading, setLoading] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const token = useToken();

    const logout = async () => {
        setLoading(true);
        try {
            const response = await post({
                endpoint: 'auth/logout',
                bearerToken: token
            });
            if(response.status){
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                location.href = '/';
                setIsLogout(true)
            } else {
                // API'den hata mesajı geldi ama status false
                alert(response.message || 'Çıkış yapılırken bir hata oluştu.');
            }
        }catch (e){
            // Network hatası veya başka bir hata
            alert(e.message || 'Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
        }finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant='destructive'>
                        Çıkış Yap
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Çıkış yapmak istediğine emin misin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Güvenli bir şekilde oturumunuzu sonlandırılacaktır.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction className={`bg-red-600 hover:bg-red-700 ${loading || isLogout && 'opacity-30 pointer-events-none'}`} onClick={(e) => {
                            e.preventDefault(); // Otomatik kapanmayı engelle
                            logout(); // Çıkış fonksiyonunu çağır
                        }}>{loading ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Çıkış yapılıyor
                            </>
                        ) : 'Çıkış Yap'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};