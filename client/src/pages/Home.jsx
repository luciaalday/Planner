import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'

export default function Home() {
    const { lang } = useContext(LanguageContext);
    return(
        <article className='home'>
            <h1>RSVP to Mili and Angel's Wedding!</h1>
            <h2>{lang == 'es' ? 'Entra tu nombre aqui' : 'Enter your name'}</h2>
            <input 
                type='text'
                placeholder={lang == 'es' ? 'Primer Nombre' : 'First Name'}
            />
            <input
                type='text'
                placeholder={lang=='es' ? 'Apellido' : 'Last name'}
            />
        </article>
    )
}