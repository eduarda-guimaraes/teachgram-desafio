import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { feedPosts } from '../data/mock'
import { Modal } from '../components/Modal'

const relatedItems = feedPosts.slice(0, 2)

export const PostDetailsPage = () => {
  const { id } = useParams()
  const post = feedPosts.find((item) => String(item.id) === id)
  const [showDelete, setShowDelete] = useState(false)

  if (!post) {
    return (
      <div className="single-page-card">
        <p className="section-eyebrow">Publicação não encontrada</p>
        <h1>Não foi possível abrir este post.</h1>
        <p>Talvez ele tenha sido removido ou o link esteja incorreto.</p>
        <Link to="/feed" className="primary-button">
          Voltar ao feed
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="page-layout page-layout--detail">
        <section className="content-panel content-panel--wide detail-panel">
          <div className="detail-panel__hero">
            <span className={post.isPrivate ? 'post-badge post-badge--private' : 'post-badge'}>
              {post.isPrivate ? 'Privado' : 'Público'}
            </span>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </div>

          <div className="detail-meta-grid">
            <article className="detail-meta-card">
              <strong>{post.likesCount}</strong>
              <span>Curtidas</span>
            </article>
            <article className="detail-meta-card">
              <strong>18</strong>
              <span>Comentários</span>
            </article>
            <article className="detail-meta-card">
              <strong>3 min</strong>
              <span>Leitura</span>
            </article>
          </div>

          <div className="content-panel content-panel--nested">
            <div className="content-panel__header">
              <div>
                <p className="section-eyebrow">Comentários</p>
                <h2>Conversa da comunidade</h2>
              </div>
            </div>

            <div className="comment-list">
              <article className="comment-item">
                <strong>Ana Clara</strong>
                <p>Gostei da organização dos checkpoints, ficou simples de acompanhar.</p>
              </article>
              <article className="comment-item">
                <strong>Camila Rocha</strong>
                <p>Esse formato ajuda muito na retomada das turmas híbridas.</p>
              </article>
            </div>

            <label className="field">
              <span>Adicionar comentário</span>
              <textarea rows={4} placeholder="Escreva sua resposta..." />
            </label>

            <div className="form-actions">
              <button type="button" className="secondary-button">
                Salvar rascunho
              </button>
              <button type="button" className="primary-button">
                Publicar comentário
              </button>
            </div>
          </div>
        </section>

        <aside className="page-aside">
          <section className="content-panel content-panel--aside">
            <div className="content-panel__header">
              <div>
                <p className="section-eyebrow">Relacionados</p>
                <h2>Outras ideias parecidas</h2>
              </div>
            </div>

            <div className="related-list">
              {relatedItems.map((item) => (
                <article key={item.id} className="related-item">
                  <span className="related-item__index">0{item.id}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="content-panel content-panel--aside">
            <div className="content-panel__header">
              <div>
                <p className="section-eyebrow">Ação rápida</p>
                <h2>Compartilhe o post</h2>
              </div>
            </div>

            <div className="stack-card">
              <p>Convide amigos para verem essa ideia e ampliarem a conversa.</p>
              <button type="button" className="secondary-button secondary-button--full">
                Copiar link
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setShowDelete(true)}>
                Excluir publicação
              </button>
            </div>
          </section>
        </aside>
      </div>

      <Modal
        open={showDelete}
        title="Excluir publicação?"
        subtitle="Essa ação não poderá ser desfeita"
        onClose={() => setShowDelete(false)}
        size="sm"
      >
        <div className="d-grid gap-3">
          <p className="mb-0 small text-muted">Você realmente deseja apagar esta publicação?</p>
          <div className="d-flex justify-content-center gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDelete(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setShowDelete(false)}>
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
