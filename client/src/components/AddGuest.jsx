import { useState } from 'react'
import { IoMdPersonAdd } from 'react-icons/io'
import { addGuest } from '../server/config'

export default function AddGuest({ groupId, onGuestAdded }) {
    const [name, setName] = useState('')
    const [plusOne, setPlusOne] = useState(false)
    const [show, setShow] = useState(false)

    const handleAddGuest = async (e) => {
        e.preventDefault()
        try {
            await addGuest({ name: name.trim(), plusOne, createdAt: new Date() }, groupId)
            setName('')
            setPlusOne(false)
            setShow(false)
            if (onGuestAdded) await onGuestAdded()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            {show ? (
                <form onSubmit={handleAddGuest} className='add-guest'>
                    <div className='pair'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='pair'>
                        <label htmlFor='plusone'>Plus one:</label>
                        <input
                            type='checkbox'
                            id='plusone'
                            checked={plusOne}
                            onChange={(e) => setPlusOne(e.target.checked)}
                        />
                    </div>
                    <div className='pair'>
                        <button type='submit'>Add guest</button>
                        <button type='button' onClick={() => setShow(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                    <button type='button' onClick={() => setShow(true)}>
                        <IoMdPersonAdd />
                    </button>
            )}
        </>
    )
}