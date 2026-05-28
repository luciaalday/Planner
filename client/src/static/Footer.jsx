import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'

export default function Footer() {
    const { changeLang } = useContext(LanguageContext);

    const handleLanguageClick = (language) => {
        changeLang(language);
    };

    return (
        <footer>
            <button className="language" onClick={() => handleLanguageClick('en')}>
                English
            </button>
            <button className="language" onClick={() => handleLanguageClick('es')}>
                Espa&ntilde;ol
            </button>
        </footer>
    )
}