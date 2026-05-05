import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const nav = useNavigate();

    useEffect(() => {
        const language = localStorage.getItem('language');
        if (language === 'english' || language === 'spanish') {
            nav('/rsvp');
        }
    }, [nav]);

    const handleLanguageClick = (language) => {
        localStorage.setItem('language', language);
        nav('/rsvp');
    };

    return(
        <main>
            <button className="language" onClick={() => handleLanguageClick('english')}>
                English
            </button>
            <button className="language" onClick={() => handleLanguageClick('spanish')}>
                Espa&ntilde;ol
            </button>
        </main>
    )
}