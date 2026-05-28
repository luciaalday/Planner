import { useState } from 'react';
import GuestTable from '../components/GuestTable';
import Error from './Error';


export default function Dashboard() {
    const [loggedin, setLoggedin] = useState(() => {
        const saved = localStorage.getItem('loggedin');
        return saved === 'true';
    });

    const logOut = async () => {
        localStorage.removeItem('loggedin');
        setLoggedin(false);
    }

    return (
        <>
        {loggedin ? 
        <article className='dashboard'>
            <h1>Dashboard</h1>
            <GuestTable />
            <button onClick={logOut}>Log out</button>
        </article> : <Error code={401} link={'/login'} redirect={'Login page'} />}
        </>
    );
}