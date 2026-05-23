import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFriends } from '../services/userService'
import { getApiErrorMessage } from '../services/errorService'
import type { UserSummary } from '../types'

const PAGE_SIZE = 4

export const FriendsPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [friends, setFriends] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchFriends()
      .then((response) => setFriends(response))
      .catch((error) => setErrorMessage(getApiErrorMessage(error, 'Não foi possível carregar seus amigos.')))
      .finally(() => setLoading(false))
  }, [])

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return friends
    }

    return friends.filter((friend) =>
      [friend.name, friend.username, friend.bio ?? ''].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [friends, search])

  const totalPages = Math.max(1, Math.ceil(filteredFriends.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageFriends = filteredFriends.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

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
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar amigos"
              aria-label="Buscar amigos"
            />
          </div>
        </div>

        <section className="friends-page__modal modal-content border-0 rounded-4 shadow-lg">
          <header className="friends-page__header modal-header border-0 pb-2">
            <h2 className="modal-title h6 fw-bold mb-0">Amigos</h2>
            <Link to="/feed" className="friends-page__close btn btn-link p-0 text-decoration-none" aria-label="Fechar">
              x
            </Link>
          </header>

          <div className="modal-body pt-2">
            {errorMessage ? <div className="auth-alert auth-alert--error mb-3">{errorMessage}</div> : null}

            <div className="friends-page__list list-group list-group-flush">
              {loading ? (
                <div className="empty-state">
                  <h3>Carregando amigos</h3>
                  <p>Estamos buscando sua rede agora.</p>
                </div>
              ) : pageFriends.length > 0 ? (
                pageFriends.map((friend) => (
                  <article key={friend.id} className="friend-row list-group-item px-0 py-2 border-0">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="friend-row__avatar flex-shrink-0"
                        style={
                          friend.profileLink
                            ? {
                                backgroundImage: `url(${friend.profileLink})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: 'transparent',
                              }
                            : undefined
                        }
                      >
                        {friend.name
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase())
                          .join('')}
                      </div>

                      <div className="friend-row__content flex-grow-1">
                        <strong className="d-block">{friend.name}</strong>
                        <p className="mb-0 text-muted small">@{friend.username}</p>
                      </div>

                      <Link to={`/perfil/${friend.id}`} className="friend-row__button btn btn-danger btn-sm">
                        Ver perfil
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <h3>Nenhum amigo encontrado</h3>
                  <p>Quando você adicionar conexões, elas aparecem aqui.</p>
                </div>
              )}
            </div>
          </div>

          <footer className="friends-page__pagination modal-footer border-0 pt-0 justify-content-center">
            <nav aria-label="Paginação de amigos">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}>
                  <button type="button" className="page-link" aria-label="Anterior" onClick={() => setPage((current) => Math.max(1, current - 1))}>
                    ←
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                  <li key={item} className="page-item">
                    <button
                      type="button"
                      className={`page-link ${item === safePage ? 'active' : ''}`}
                      aria-current={item === safePage ? 'page' : undefined}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${safePage === totalPages ? 'disabled' : ''}`}>
                  <button type="button" className="page-link" aria-label="Próxima" onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
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
