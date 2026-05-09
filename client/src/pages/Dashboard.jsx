import { useState, useEffect } from 'react';
import GuestTable from '../components/GuestTable';
import Error from './Error';

export default function Dashboard() {
    const [loggedin, setLoggedin] = useState(() => {
        const saved = localStorage.getItem('loggedin');
        return saved === 'true';
    });

    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const logOut = async () => {
        localStorage.removeItem('loggedin');
        setLoggedin(false);
    }

    return (
        <>
        {loggedin ? 
        <article className='dashboard'>
            <h1>Dashboard</h1>
            <form>
            </form>
            {error && <div className="banner error">{error}</div>}
            {success && <div className="banner success">{success}</div>}
            <GuestTable guests={guests} loading={loading} onRefresh={fetchGuests} />
            <button onClick={logOut}>Log out</button>
        </article> : <Error code={401} link={'/login'} redirect={'Login page'} />}
        </>
    );
}