import { useContext } from 'react';
import GuestTable from '../components/GuestTable';
import { LanguageContext } from '../contexts/LanguageContext';

export default function Rsvp() {
    const { lang } = useContext(LanguageContext);

    return (
        <article className='rsvp'>
            
        </article>
    );
}