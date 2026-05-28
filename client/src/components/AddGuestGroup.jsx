import { useState } from 'react';
import { MdOutlineAddToPhotos } from 'react-icons/md'
import { addGuestGroup } from '../server/config';

export default function AddGuestGroup({ onGroupAdded }) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleAddGuestGroup = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name cannot be empty');
            setSuccess('');
            setTimeout(() => setError(''), 2000);
            return;
        }

        try {
            const docRef = await addGuestGroup({ name: name.trim() });
            if (docRef) {
                setSuccess('Group added successfully');
                setError('');
                setName('');
                setShow(false);
                if (onGroupAdded) await onGroupAdded();
                setTimeout(() => setSuccess(''), 2000);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to add group');
            setSuccess('');
            setTimeout(() => setError(''), 2000);
        }
    }

    return (
        <>
            {show ? <div className='guest-group-tile center'>
                <form onSubmit={handleAddGuestGroup}>
                    <input
                        type='text'
                        value={name}
                        placeholder='New group name'
                        onChange={(e) => setName(e.target.value)}
                        id='name'
                        />
                    <button type='submit'>Add group</button>
                    <button type='button' onClick={() => setShow(false)}>Cancel</button>
                </form>
            </div>
            : 
                <button type='button' onClick={() => setShow(true)}>
                    <MdOutlineAddToPhotos />
                </button>
            }
            <div className={`message ${success ? 'success' : error ? 'error' : ''}`}>{success || error}</div>
        </>
    )
} 