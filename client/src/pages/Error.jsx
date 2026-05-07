import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LanguageContext } from '../contexts/LanguageContext'

export default function Error({ code, url = null, link=null, redirect=null }) {
    const { lang } = useContext(LanguageContext);

    const message = {
        307: 'Page has temporarily been moved to',
        308: 'Page has permanently been moved to',
        400: 'Request cannot be filled due to bad syntax',
        401: 'Authentication required',
        402: 'Payment required',
        403: 'Access denied',
        404: 'Page not found',
        500: 'Internal server error'
    };

    const mensaje = {
        307: 'La página se ha movido temporalmente a',
        308: 'La página se ha movido permanentemente a',
        400: 'La solicitud no se puede completar debido a una sintaxis incorrecta',
        401: 'Inicie sesión e intente acceder a esta página nuevamente',
        402: 'Pago requerido',
        403: 'Acceso denegado',
        404: 'Página no encontrada',
        500: 'Error interno del servidor'
    };

    return (
        <article className='error'>
            <h1>Error {code}</h1>
            <p>{lang === 'es' ? mensaje[code] : message[code]}</p>
            {url && <a href={url}>{redirect??url}</a>}
            {link && <Link to={link}>{redirect??link}</Link>}
        </article>
    );
}