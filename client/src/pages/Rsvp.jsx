import { useContext } from 'react';
import GuestTable from '../components/GuestTable';
import { LanguageContext } from '../contexts/LanguageContext';

export default function Rsvp() {
    const { lang } = useContext(LanguageContext);

    return (
        <article className='rsvp'>
            <h1>{lang === 'es' ? 'RSVP - Lista de Invitados' : 'RSVP - Guest List'}</h1>
            <GuestTable />
        </article>
    );
}