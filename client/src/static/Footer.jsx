import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { FaUserShield, FaFeatherAlt } from 'react-icons/fa'

export default function Footer() {
    const nav = useNavigate();
    const { changeLang } = useContext(LanguageContext);

    const handleLanguageClick = (language) => {
        changeLang(language);
    };

    return (
        <footer>
            <button className="icon" title="RSVP"><FaFeatherAlt size={20} /></button>
            <div>
                <button className="language" onClick={() => handleLanguageClick('en')}>
                    English
                </button>
                <button className="language" onClick={() => handleLanguageClick('es')}>
                    Espa&ntilde;ol
                </button>
            </div>
            <button className="icon" onClick={() => nav("/login")} title="Manage"><FaUserShield size={20} /></button>
        </footer>
    )
}