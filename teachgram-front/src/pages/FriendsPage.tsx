import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFriends } from '../services/userService'
import { getApiErrorMessage } from '../services/errorService'
import { getImageUrl } from '../utils/ImageUtils'
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
    <div className="friends-page">
      <div className="friends-page__backdrop" />

      <section className="friends-page__modal">
        <header className="friends-page__header">
          <h2>Amigos</h2>
          <Link to="/feed" className="friends-page__close" aria-label="Fechar">
            x
          </Link>
        </header>

        <div className="friends-page__search-wrapper mb-3">
          <div className="inline-search w-100">
            <span aria-hidden="true">⌕</span>
            <input
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

        <div className="friends-page__list">
          {errorMessage ? <div className="auth-alert auth-alert--error">{errorMessage}</div> : null}

          {loading ? (
            <div className="empty-state">
              <h3>Carregando amigos</h3>
              <p>Estamos buscando sua rede agora.</p>
            </div>
          ) : pageFriends.length > 0 ? (
            pageFriends.map((friend) => (
              <article key={friend.id} className="friend-row">
                <div className="friend-row__avatar"
                     style={
                       friend.profileLink
                         ? {
                             backgroundImage: `url(${getImageUrl(friend.profileLink)})`,
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

                <div className="friend-row__content">
                  <strong>{friend.name}</strong>
                  <p>@{friend.username}</p>
                </div>

                <Link to={`/perfil/${friend.id}`} className="friend-row__button">
                  Ver perfil
                </Link>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>Nenhum amigo encontrado</h3>
              <p>Quando você adicionar conexões, elas aparecem aqui.</p>
            </div>
          )}
        </div>

        <footer className="friends-page__pagination mt-3">
          <nav aria-label="Paginação de amigos">
            <ul className="pagination pagination-sm justify-content-center m-0">
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
  )
}
