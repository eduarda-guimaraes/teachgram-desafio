import { useMemo, useState } from 'react'
import { friendSuggestions } from '../data/mock'

const statusLabel: Record<'online' | 'busy' | 'studying', string> = {
  online: 'Ver perfil',
  busy: 'Ver perfil',
  studying: 'Ver perfil',
}

export const FriendsPage = () => {
  const [search, setSearch] = useState('')

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return friendSuggestions
    }

    return friendSuggestions.filter((friend) =>
      [friend.name, friend.username, friend.bio, friend.course].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [search])

  return (
    <div className="friends-page">
      <section className="friends-page__backdrop" aria-hidden="true" />

      <div className="friends-page__modal">
        <header className="friends-page__header">
          <h2>Amigos</h2>
          <button type="button" className="friends-page__close" aria-label="Fechar">
            ×
          </button>
        </header>

        <div className="friends-page__list">
          {filteredFriends.map((friend) => (
            <article key={friend.id} className="friend-row">
              <div className={`friend-row__avatar friend-card__avatar--${friend.avatarSeed}`}>
                {friend.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join('')}
              </div>

              <div className="friend-row__content">
                <strong>{friend.username.replace('@', '')}</strong>
                <p>{friend.name}</p>
              </div>

              <button type="button" className="friend-row__button">
                {statusLabel[friend.status]}
              </button>
            </article>
          ))}
        </div>

        <footer className="friends-page__pagination" aria-label="Paginação de amigos">
          <button type="button">←</button>
          <button type="button" className="is-active">
            1
          </button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">4</button>
          <button type="button">→</button>
        </footer>
      </div>

      <div className="friends-page__search">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar amigos"
          aria-label="Buscar amigos"
        />
      </div>
    </div>
  )
}
