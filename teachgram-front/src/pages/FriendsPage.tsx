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
    <div className="friends-page position-relative min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4">
      <div className="friends-page__backdrop position-absolute top-0 start-0 w-100 h-100" />

      <div className="position-relative z-1 w-100" style={{ maxWidth: '520px' }}>
        <div className="d-flex justify-content-end mb-3">
          <div className="input-group input-group-sm friends-page__search shadow-sm">
            <span className="input-group-text bg-white border-end-0">⌕</span>
            <input
              className="form-control border-start-0"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar amigos"
              aria-label="Buscar amigos"
            />
          </div>
        </div>

        <section className="friends-page__modal modal-content border-0 rounded-4 shadow-lg">
          <header className="friends-page__header modal-header border-0 pb-2">
            <h2 className="modal-title h6 fw-bold mb-0">Amigos</h2>
            <button type="button" className="friends-page__close btn btn-link p-0 text-decoration-none" aria-label="Fechar">
              ×
            </button>
          </header>

          <div className="modal-body pt-2">
            <div className="friends-page__list list-group list-group-flush">
              {filteredFriends.map((friend) => (
                <article key={friend.id} className="friend-row list-group-item px-0 py-2 border-0">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`friend-row__avatar friend-card__avatar--${friend.avatarSeed} flex-shrink-0`}>
                      {friend.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('')}
                    </div>

                    <div className="friend-row__content flex-grow-1">
                      <strong className="d-block">{friend.username.replace('@', '')}</strong>
                      <p className="mb-0 text-muted small">{friend.name}</p>
                    </div>

                    <button type="button" className="friend-row__button btn btn-danger btn-sm">
                      {statusLabel[friend.status]}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <footer className="friends-page__pagination modal-footer border-0 pt-0 justify-content-center">
            <nav aria-label="Paginação de amigos">
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item">
                  <button type="button" className="page-link" aria-label="Anterior">
                    ←
                  </button>
                </li>
                <li className="page-item">
                  <button type="button" className="page-link active" aria-current="page">
                    1
                  </button>
                </li>
                <li className="page-item">
                  <button type="button" className="page-link">
                    2
                  </button>
                </li>
                <li className="page-item">
                  <button type="button" className="page-link">
                    3
                  </button>
                </li>
                <li className="page-item">
                  <button type="button" className="page-link">
                    4
                  </button>
                </li>
                <li className="page-item">
                  <button type="button" className="page-link" aria-label="Próxima">
                    →
                  </button>
                </li>
              </ul>
            </nav>
          </footer>
        </section>
      </div>
    </div>
  )
}
