import { useContext, useState } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'
import { searchGuestsByName } from '../server/config'

export default function Home() {
    const { lang } = useContext(LanguageContext)
    const [name, setName] = useState('')
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSearch = async (e) => {
        e.preventDefault()
        const trimmedName = name.trim()
        if (!trimmedName) {
            setMessage(lang === 'es' ? 'Por favor ingresa un nombre' : 'Please enter a name')
            setGroups([])
            return
        }

        setLoading(true)
        setMessage('')
        setSelectedGroup(null)

        try {
            const guests = await searchGuestsByName(trimmedName)
            const groupMap = new Map()

            guests.forEach(guest => {
                if (!guest.groupId) return
                if (!groupMap.has(guest.groupId)) {
                    groupMap.set(guest.groupId, {
                        groupId: guest.groupId,
                        groupName: guest.groupName,
                        guests: [guest]
                    })
                } else {
                    groupMap.get(guest.groupId).guests.push(guest)
                }
            })

            const groupResults = Array.from(groupMap.values())
            setGroups(groupResults)
            if (!groupResults.length) {
                setMessage(lang === 'es' ? 'No se encontraron coincidencias' : 'No matches found')
            }
        } catch (err) {
            console.error(err)
            setMessage(lang === 'es' ? 'Error al buscar invitados' : 'Error searching guests')
        } finally {
            setLoading(false)
        }
    }

    return (
        <article className='home'>
            <h1>{lang === 'es' ? 'RSVP a la boda de Mili y Angel' : "RSVP to Mili and Angel's Wedding"}</h1>

            <form className='search-form' onSubmit={handleSearch}>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'es' ? 'Ingresa tu nombre aquí' : 'Enter your name here'}
                />
                <button type='submit' disabled={loading}>
                    {loading ? (lang === 'es' ? 'Buscando...' : 'Searching...') : (lang === 'es' ? 'Buscar' : 'Search')}
                </button>
            </form>

            {message && <p className='search-message'>{message}</p>}

            {groups.length > 0 && (
                <section className='search-results'>
                    <h2>{lang === 'es' ? 'Selecciona tu grupo' : 'Select your group'}</h2>
                    {groups.map((group) => (
                        <div key={group.groupId} className='group-result'>
                            <h3>{group.groupName || (lang === 'es' ? 'Grupo desconocido' : 'Unknown group')}</h3>
                            <p>
                                {lang === 'es' ? 'Coincidencias:' : 'Matches:'}{' '}
                                {group.guests.map((guest) => guest.name).join(', ')}
                            </p>
                            <button type='button' onClick={() => setSelectedGroup(group)}>
                                {lang === 'es' ? 'Seleccionar este grupo' : 'Select this group'}
                            </button>
                        </div>
                    ))}
                </section>
            )}

            {selectedGroup && (
                <section className='selected-group'>
                    <h2>{lang === 'es' ? 'Grupo seleccionado' : 'Selected group'}</h2>
                    <p>{selectedGroup.groupName}</p>
                    <p>
                        {lang === 'es' ? 'Invitados' : 'Guests'}:{' '}
                        {selectedGroup.guests.map((guest) => guest.name).join(', ')}
                    </p>
                    <p>{lang === 'es' ? 'Continúa al siguiente paso para confirmar tu RSVP.' : 'Continue to the next step to confirm your RSVP.'}</p>
                </section>
            )}
        </article>
    )
}