import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { User as AuthUser } from '../models/User'

interface NewPostPageProps {
  currentUser: AuthUser | null
}

const initialValues = {
  title: '',
  description: '',
  topic: 'Planejamento',
  visibility: 'public',
  resourceLink: '',
}

export const NewPostPage = ({ currentUser }: NewPostPageProps) => {
  const [form, setForm] = useState(initialValues)
  const [message, setMessage] = useState('')

  const previewTitle = form.title || 'Título da sua publicação'
  const previewDescription =
    form.description || 'Escreva uma ideia, compartilhe um material ou descreva uma prática que pode inspirar outras pessoas.'

  const previewTag = useMemo(
    () => (form.visibility === 'private' ? 'Privado' : 'Público'),
    [form.visibility],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('Sua publicação foi preparada com sucesso para a comunidade.')
    setForm(initialValues)
  }

  return (
    <div className="page-layout page-layout--compose">
      <section className="content-panel content-panel--wide">
        <div className="content-panel__header">
          <div>
            <p className="section-eyebrow">Novo conteúdo</p>
            <h2>Monte uma nova publicação</h2>
          </div>
        </div>

        <form className="compose-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Título</span>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Ex.: Planejamento com projeto interdisciplinar"
            />
          </label>

          <label className="field">
            <span>Descrição</span>
            <textarea
              rows={6}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Escreva detalhes, contextos e aprendizados da sua ideia."
            />
          </label>

          <div className="form-grid form-grid--two">
            <label className="field">
              <span>Tema</span>
              <select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
                <option>Planejamento</option>
                <option>Materiais</option>
                <option>Metodologia</option>
                <option>Avaliação</option>
              </select>
            </label>

            <label className="field">
              <span>Link de apoio</span>
              <input
                value={form.resourceLink}
                onChange={(event) => setForm({ ...form, resourceLink: event.target.value })}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="visibility-row">
            <label className="radio-pill">
              <input
                type="radio"
                name="visibility"
                checked={form.visibility === 'public'}
                onChange={() => setForm({ ...form, visibility: 'public' })}
              />
              <span>Público</span>
            </label>
            <label className="radio-pill">
              <input
                type="radio"
                name="visibility"
                checked={form.visibility === 'private'}
                onChange={() => setForm({ ...form, visibility: 'private' })}
              />
              <span>Privado</span>
            </label>
          </div>

          {message ? <div className="auth-alert auth-alert--success">{message}</div> : null}

          <div className="form-actions">
            <button type="button" className="secondary-button">
              Salvar rascunho
            </button>
            <button type="submit" className="primary-button">
              Publicar agora
            </button>
          </div>
        </form>
      </section>

      <aside className="page-aside">
        <section className="content-panel content-panel--aside">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Pré-visualização</p>
              <h2>Como a comunidade verá sua postagem</h2>
            </div>
          </div>

          <article className="preview-card">
            <div className="preview-card__top">
              <span className="post-badge">{previewTag}</span>
              <span>{form.topic}</span>
            </div>
            <h3>{previewTitle}</h3>
            <p>{previewDescription}</p>
            <div className="preview-card__author">
              <div className="preview-card__avatar">{currentUser?.name?.[0] ?? 'M'}</div>
              <div>
                <strong>{currentUser?.name ?? 'Teachgram'}</strong>
                <small>@{currentUser?.username ?? 'teachgram'}</small>
              </div>
            </div>
          </article>
        </section>

        <section className="content-panel content-panel--aside">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Boa prática</p>
              <h2>Publicações que engajam</h2>
            </div>
          </div>

          <ul className="tip-list tip-list--compact">
            <li>Use títulos claros e orientados a ação.</li>
            <li>Explique o contexto em dois ou três parágrafos curtos.</li>
            <li>Inclua um link de apoio para enriquecer a leitura.</li>
          </ul>
        </section>
      </aside>
    </div>
  )
}
