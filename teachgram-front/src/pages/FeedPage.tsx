import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from '../components/PostCard'
import { feedPosts, highlightCards, teachingTips } from '../data/mock'
import type { User as AuthUser } from '../models/User'

interface FeedPageProps {
  currentUser: AuthUser | null
}

export const FeedPage = ({ currentUser }: FeedPageProps) => {
  const [search, setSearch] = useState('')

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return feedPosts
    }

    return feedPosts.filter((post) => {
      const author = post.user.name ?? post.user.username ?? ''
      return [post.title, post.description ?? '', author].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
  }, [search])

  return (
    <div className="page-layout page-layout--feed">
      <section className="feed-column">
        <div className="highlight-grid">
          {highlightCards.map((card) => (
            <article key={card.label} className={`highlight-card highlight-card--${card.tone}`}>
              <span className="section-eyebrow">{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="content-panel">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Feed da comunidade</p>
              <h2>Últimas publicações</h2>
            </div>
            <label className="inline-search">
              <span aria-hidden="true">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filtrar publicações"
              />
            </label>
          </div>

          <div className="post-list">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhuma publicação encontrada</h3>
              <p>Tente outro termo ou crie uma nova ideia para compartilhar com a comunidade.</p>
              <Link to="/publicar" className="primary-button">
                Criar publicação
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <aside className="page-aside">
        <section className="content-panel content-panel--aside">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Atalho rápido</p>
              <h2>O que você pode fazer hoje</h2>
            </div>
          </div>

          <div className="aside-cta">
            <p>
              {currentUser?.name ?? 'Você'} pode começar uma nova conversa, publicar um material ou
              revisar ideias salvas.
            </p>
            <Link to="/publicar" className="primary-button primary-button--full">
              Nova publicação
            </Link>
          </div>
        </section>

        <section className="content-panel content-panel--aside">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Dicas da comunidade</p>
              <h2>Pequenos lembretes</h2>
            </div>
          </div>

          <ul className="tip-list">
            {teachingTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  )
}
