import { createContext, useState } from 'react';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    const changeLang = (newLang) => {
        setLang(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, changeLang }}>
            {children}
        </LanguageContext.Provider>
    );
}
