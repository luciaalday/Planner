import { useNavigate } from 'react-router-dom'

export default function Login() {
    const nav = useNavigate();

    const handleLogin = async () => {
        nav("/dashboard");
        return;
    }

    return (
        <article>
            <h1>Log in to manage and view responses</h1>
            <button onClick={handleLogin}>Sign in</button>
        </article>
    )
}