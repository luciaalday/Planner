import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../contexts/LanguageContext'

export default function Home() {
    const nav = useNavigate();
    const { changeLang } = useContext(LanguageContext);

    const handleLanguageClick = (language) => {
        changeLang(language);
        nav('/rsvp');
    };

    return(
        <article>
            <button className="language" onClick={() => handleLanguageClick('en')}>
                English
            </button>
            <button className="language" onClick={() => handleLanguageClick('es')}>
                Espa&ntilde;ol
            </button>
        </article>
    )
}