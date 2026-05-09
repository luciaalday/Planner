// client/src/components/GuestTable.jsx
import { useState } from 'react';
import { api } from '../server/config';

export default function GuestTable({ guests, loading, onRefresh }) {
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editGuest, setEditGuest] = useState({});

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

    const handleEdit = (guest) => {
        setEditingId(guest.id);
        setEditGuest({ ...guest });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditGuest({});
    };

    const handleSaveEdit = async () => {
        try {
            await api.updateGuest(editingId, editGuest);
            setEditingId(null);
            setEditGuest({});
            onRefresh(); // Refresh the list
        } catch (err) {
            setError('Error updating guest');
            console.error('Error updating guest:', err);
        }
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditGuest(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const getUniqueGroups = () => {
        const groups = guests
            .map(g => g.group)
            .filter(g => g && g.trim() !== '')
            .filter((g, i, arr) => arr.indexOf(g) === i);
        return groups.sort();
    };

    if (loading) {
        return (
            <div className="banner loading">Loading guests...</div>
        );
    }

    if (error) {
        return (
            <div className="banner error">{error}</div>
        );
    }

    return (
        <div className="guest-table-container">
            <h2>Guest List</h2>
            <div className="table-wrapper">
                <table className="guest-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>RSVP</th>
                            <th>Attending</th>
                            <th>Meal</th>
                            <th>Plus One</th>
                            <th>Group</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="no-guests">No guests registered</td>
                            </tr>
                        ) : (
                            guests.map((guest) => (
                                editingId === guest.id ? (
                                    <tr key={guest.id}>
                                        <td><input name="firstname" value={editGuest.firstname || ''} onChange={handleEditChange} /></td>
                                        <td><input name="lastname" value={editGuest.lastname || ''} onChange={handleEditChange} /></td>
                                        <td><input name="email" type="email" value={editGuest.email || ''} onChange={handleEditChange} /></td>
                                        <td><input name="address" value={editGuest.address || ''} onChange={handleEditChange} /></td>
                                        <td><input name="rsvp" type="date" value={editGuest.rsvp || ''} onChange={handleEditChange} /></td>
                                        <td><input name="attending" type="checkbox" checked={editGuest.attending || false} onChange={handleEditChange} /></td>
                                        <td>
                                            <select name="meal" value={editGuest.meal || ''} onChange={handleEditChange}>
                                                <option value="">Select Meal</option>
                                                <option value="1">Chicken</option>
                                                <option value="2">Fish</option>
                                                <option value="3">Vegetarian</option>
                                            </select>
                                        </td>
                                        <td><input name="plus_one" type="checkbox" checked={editGuest.plus_one || false} onChange={handleEditChange} /></td>
                                        <td>
                                            <input 
                                                name="group" 
                                                value={editGuest.group || ''} 
                                                onChange={handleEditChange}
                                                list={`groups-list-${editGuest.id}`}
                                            />
                                            <datalist id={`groups-list-${editGuest.id}`}>
                                                {getUniqueGroups().map(g => (
                                                    <option key={g} value={g} />
                                                ))}
                                            </datalist>
                                        </td>
                                        <td><textarea name="note" value={editGuest.note || ''} onChange={handleEditChange}></textarea></td>
                                        <td>
                                            <button onClick={handleSaveEdit}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={guest.id}>
                                        <td>{guest.firstname}</td>
                                        <td>{guest.lastname}</td>
                                        <td>{guest.email}</td>
                                        <td>{guest.address}</td>
                                        <td>{formatBoolean(guest.rsvp)}</td>
                                        <td>{formatBoolean(guest.attending)}</td>
                                        <td>{getMealText(guest.meal)}</td>
                                        <td>{formatBoolean(guest.plus_one)}</td>
                                        <td>{guest.group || ''}</td>
                                        <td>{guest.note || ''}</td>
                                        <td><button onClick={() => handleEdit(guest)}>Edit</button></td>
                                    </tr>
                                )
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="table-info">Total guests: ${guests.length}</div>
        </div>
    );
}