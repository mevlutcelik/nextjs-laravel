"use client";
import {useState} from "react";
import { useRouter } from 'next/navigation';
import {post} from "@/utlis/request";

export default function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await post({
                endpoint: 'login',
                body: {email, password}
            })
            if (response.status) {
                // Token'ı sınırsız süreli cookie olarak ayarlayın
                const expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 10); // 10 yıl geçerlilik

                document.cookie = `token=${response.token}; path=/; expires=${expirationDate.toUTCString()};`;

                setMessage('Login successful');
                router.push('/dashboard');
            } else {
                console.log(response);
                setMessage('Login failed: ' + response.message);
            }
        } catch (error) {
            setMessage('Login failed: ' + error);
        }
    };

    return (
        <div>
            <main>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {message && <p>{message}</p>}
            </main>
        </div>
    );
}
