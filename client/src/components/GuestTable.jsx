import { useState, useEffect } from 'react';
import { api } from '../service/config';

export default function GuestTable() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchGuests = async () => {
            try {
                setLoading(true);
                const data = await api.getGuests();
                setGuests(data);
                setError(null);
            } catch (err) {
                const errorMessage = 'Error loading guests';
                setError(errorMessage);
                console.error('Error fetching guests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGuests();
    }, []);

    const formatBoolean = (value) => {
        return value ? 'Yes' : 'No';
    };

    const getMealText = (meal) => {
        if (!meal) return '';
        const meals = {
            1: 'Chicken',
            2: 'Fish',
            3: 'Vegetarian',
        };
        return meals[meal] || meal;
    };

    if (loading) {
        return (
            <div className="loading">Loading guests...</div>
        );
    }

    if (error) {
        return (
            <div className="error">{error}</div>
        );
    }

    return (
        <div className="guest-table-container">
            <h2>Guest List</h2>
            <div className="table-wrapper">
                <table className="guest-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>RSVP</th>
                            <th>Attending</th>
                            <th>Meal</th>
                            <th>Spanish</th>
                            <th>Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="no-guests">No guests registered</td>
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
            <div className="table-info">Total guests: ${guests.length}</div>
        </div>
    );
}