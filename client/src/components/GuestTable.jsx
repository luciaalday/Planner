import { useState, useEffect, useContext } from 'react';
import { api } from '../service/config';
import { LanguageContext } from '../contexts/LanguageContext';

export default function GuestTable() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { lang } = useContext(LanguageContext);
    
    useEffect(() => {
        const fetchGuests = async () => {
            try {
                setLoading(true);
                const data = await api.getGuests();
                setGuests(data);
                setError(null);
            } catch (err) {
                // Capture current language at time of error
                const currentLang = lang;
                const errorMessage = currentLang === 'es' ? 'Error al cargar invitados' : 'Error loading guests';
                setError(errorMessage);
                console.error('Error fetching guests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGuests();
    }, [lang]);

    const formatBoolean = (value) => {
        if (lang === 'es') {
            return value ? 'Sí' : 'No';
        }
        return value ? 'Yes' : 'No';
    };

    const getMealText = (meal) => {
        if (!meal) return '';
        const meals = {
            1: lang === 'es' ? 'Pollo' : 'Chicken',
            2: lang === 'es' ? 'Pescado' : 'Fish',
            3: lang === 'es' ? 'Vegetariano' : 'Vegetarian',
        };
        return meals[meal] || meal;
    };

    if (loading) {
        return (
            <div className="loading">
                {lang === 'es' ? 'Cargando invitados...' : 'Loading guests...'}
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                {error}
            </div>
        );
    }

    return (
        <div className="guest-table-container">
            <h2>{lang === 'es' ? 'Lista de Invitados' : 'Guest List'}</h2>
            <div className="table-wrapper">
                <table className="guest-table">
                    <thead>
                        <tr>
                            <th>{lang === 'es' ? 'ID' : 'ID'}</th>
                            <th>{lang === 'es' ? 'Nombre' : 'Name'}</th>
                            <th>{lang === 'es' ? 'Email' : 'Email'}</th>
                            <th>{lang === 'es' ? 'RSVP' : 'RSVP'}</th>
                            <th>{lang === 'es' ? 'Asistirá' : 'Attending'}</th>
                            <th>{lang === 'es' ? 'Comida' : 'Meal'}</th>
                            <th>{lang === 'es' ? 'Español' : 'Spanish'}</th>
                            <th>{lang === 'es' ? 'Grupo' : 'Group'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="no-guests">
                                    {lang === 'es' ? 'No hay invitados registrados' : 'No guests registered'}
                                </td>
                            </tr>
                        ) : (
                            guests.map((guest) => (
                                <tr key={guest.id}>
                                    <td>{guest.id}</td>
                                    <td>{guest.name}</td>
                                    <td>{guest.email}</td>
                                    <td>{formatBoolean(guest.rsvp)}</td>
                                    <td>{formatBoolean(guest.attending)}</td>
                                    <td>{getMealText(guest.meal)}</td>
                                    <td>{formatBoolean(guest.spanish)}</td>
                                    <td>{guest.group || ''}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="table-info">
                {lang === 'es'
                    ? `Total de invitados: ${guests.length}`
                    : `Total guests: ${guests.length}`
                }
            </div>
        </div>
    );
}