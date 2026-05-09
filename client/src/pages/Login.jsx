import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Login() {
    const nav = useNavigate();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (import.meta.env.VITE_PASSWORD === password) {
            localStorage.setItem('loggedin', 'true');
            setSuccess('Sign in successful!');
            setTimeout(()=>setSuccess(), 1000);
            nav("/dashboard");
        }
        else {
            setError('Sign in failed');
        }
        return;
    }

    return (
        <article className='login'>
            <h1>Enter password to view and manage responses</h1>
            <form onSubmit={handleLogin}>
                <input
                    placeholder="Password"
                    type="password"
                    value={password || ''}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign in</button>
            </form>
            <div className={error ? 'banner error' : success ? 'banner success' : 'hide'}>
                {error || success}
            </div>
        </article>
    )
}