/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AddGuest from './AddGuest';
import AddGuestGroup from './AddGuestGroup';
import { getGroups } from '../server/config'


export default function GuestTable() {
    const [groups, setGroups] = useState([]);

    const loadGroups = async () => {
        try {
            const data = await getGroups()
            setGroups(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        loadGroups()
    }, [])

    return (
        <div className='guest-container'>
            {groups.map(group => (
                <div key={group.id} className='guest-group-tile'>
                    <h3>{group.name}</h3>
                    {group.guests?.map((guest, idx) => (
                        <div key={guest.id ?? idx} className='guest-tile'>
                            <p>{idx + 1}. {guest.name}</p>
                        </div>
                    ))}
                    <AddGuest groupId={group.id} onGuestAdded={loadGroups} />
                </div>
            ))}
            <AddGuestGroup onGroupAdded={loadGroups} />

        </div>
    )
}