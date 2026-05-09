import { useState, useEffect } from 'react';
import GuestTable from '../components/GuestTable';
import Error from './Error';
import { api } from '../server/config';

export default function Dashboard() {
    const [loggedin, setLoggedin] = useState(() => {
        const saved = localStorage.getItem('loggedin');
        return saved === 'true';
    });
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGuest, setNewGuest] = useState({
        firstname: '',
        lastname: '',
        email: '',
        address: '',
        rsvp: '',
        attending: false,
        meal: '',
        plus_one: false,
        group: '',
        note: ''
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchGuests();
    }, []);

    const logOut = async () => {
        localStorage.removeItem('loggedin');
        setLoggedin(false);
    }

    const fetchGuests = async () => {
        try {
            setLoading(true);
            const data = await api.getGuests();
            setGuests(data);
            setError(null);
        } catch (err) {
            setError('Error loading guests');
            console.error('Error fetching guests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGuest = async (e) => {
        e.preventDefault();
        try {
            await api.createGuest(newGuest);
            setNewGuest({
                firstname: '',
                lastname: '',
                email: '',
                rsvp: new Date(),
                attending: false,
                meal: '',
                plus_one: false,
                group: '',
                note: ''
            });
            fetchGuests();
        } catch (err) {
            setError('Error adding guest');
            console.error('Error adding guest:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewGuest(prev => ({
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

    return (
        <>
        {loggedin ? 
        <article className='dashboard'>
            <h1>Dashboard</h1>
            <form onSubmit={handleAddGuest} className="add-guest-form">
                <h2>Add New Guest</h2>
                <div className="form-row">
                    <input name="firstname" placeholder="First Name" value={newGuest.firstname} onChange={handleInputChange} required />
                    <input name="lastname" placeholder="Last Name" value={newGuest.lastname} onChange={handleInputChange} required />
                    <input name="email" type="email" placeholder="Email" value={newGuest.email} onChange={handleInputChange} />
                </div>
                <div className="form-row">
                    <select name="meal" value={newGuest.meal} onChange={handleInputChange}>
                        <option value="">Select Meal</option>
                        <option value="1">Chicken</option>
                        <option value="2">Fish</option>
                        <option value="3">Vegetarian</option>
                    </select>
                </div>
                <div className="form-row">
                    <input 
                        name="group" 
                        placeholder="Group" 
                        value={newGuest.group} 
                        onChange={handleInputChange}
                        list="groups-list"
                    />
                    <datalist id="groups-list">
                        {getUniqueGroups().map(g => (
                            <option key={g} value={g} />
                        ))}
                    </datalist>
                    <textarea name="note" placeholder="Note" value={newGuest.note} onChange={handleInputChange}></textarea>
                </div>
                <div className="form-row">
                    <label><input name="plus_one" type="checkbox" checked={newGuest.plus_one} onChange={handleInputChange} /> Plus One</label>
                </div>
                <button type="submit">Add Guest</button>
            </form>
            {error && <div className="banner error">{error}</div>}
            <GuestTable guests={guests} loading={loading} onRefresh={fetchGuests} />
            <button onClick={logOut}>Log out</button>
        </article> : <Error code={401} link={'/login'} redirect={'Login page'} />}
        </>
    );
}