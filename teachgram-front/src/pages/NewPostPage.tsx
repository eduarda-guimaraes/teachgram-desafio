import { useMemo, useState, type FormEvent } from 'react'
import type { User as AuthUser } from '../models/User'
import { Modal } from '../components/Modal'
import heroImg from '../assets/hero.png'
import { createPost } from '../services/postService'
import { getApiErrorMessage } from '../services/errorService'

interface NewPostPageProps {
  currentUser: AuthUser | null
}

const initialValues = {
  title: '',
  description: '',
  visibility: 'public',
  resourceLink: '',
}

export const NewPostPage = ({ currentUser }: NewPostPageProps) => {
  const [form, setForm] = useState(initialValues)
  const [showModal, setShowModal] = useState(true)
  const [step, setStep] = useState<'link' | 'compose'>('link')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const previewTitle = form.title || 'Titulo da sua publicacao'
  const previewDescription =
    form.description ||
    'Escreva uma ideia, compartilhe um material ou descreva uma pratica que pode inspirar outras pessoas.'

  const previewTag = useMemo(
    () => (form.visibility === 'private' ? 'Privado' : 'Publico'),
    [form.visibility],
  )

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      await createPost({
        title: form.title || 'Nova publicacao',
        description: form.description,
        photoLink: form.resourceLink || undefined,
        isPrivate: form.visibility === 'private',
      })

      setMessage('Sua publicacao foi compartilhada com sucesso.')
      setForm(initialValues)
      setStep('link')
      closeModal()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel criar a publicacao.'))
    } finally {
      setLoading(false)
    }
  }

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStep('compose')
  }

  return (
    <div className="page-layout page-layout--compose position-relative">
      <section className="content-panel content-panel--wide">
        <div className="content-panel__header">
          <div>
            <p className="section-eyebrow">Novo conteudo</p>
            <h2>Monte uma nova publicacao</h2>
          </div>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowModal(true)}>
            Abrir modal
          </button>
        </div>

        <div className="compose-page__hint alert alert-light border small mb-0">
          O fluxo abaixo abre como modal, igual ao Figma. Se preferir, use o botao para reabrir.
        </div>

        {message ? <div className="auth-alert auth-alert--success mt-3">{message}</div> : null}
        {errorMessage ? <div className="auth-alert auth-alert--error mt-3">{errorMessage}</div> : null}

        <div className="content-panel content-panel--nested mt-3">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Pre-visualizacao</p>
              <h2>Como a comunidade vera sua postagem</h2>
            </div>
          </div>

          <article className="preview-card">
            <div className="preview-card__top">
              <span className="post-badge">{previewTag}</span>
              <span>{form.resourceLink ? 'Com midia' : 'Somente texto'}</span>
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
        </div>
      </section>

      <Modal
        open={showModal}
        title="Criar nova publicacao"
        subtitle={step === 'link' ? 'Adicione um link para comecar' : 'Escreva o conteudo da postagem'}
        onClose={closeModal}
        size={step === 'link' ? 'sm' : 'md'}
        className={step === 'link' ? 'teachgram-modal--post-link' : 'teachgram-modal--post-compose'}
      >
        {step === 'link' ? (
          <form className="teachgram-modal__stack" onSubmit={handleNext}>
            <input
              className="form-control form-control-sm"
              value={form.resourceLink}
              onChange={(event) => setForm({ ...form, resourceLink: event.target.value })}
              placeholder="Cole um link ou recurso"
            />

            <div className="d-flex align-items-center gap-2">
              <label className="form-check d-flex align-items-center gap-2 mb-0">
                <input
                  className="form-check-input m-0"
                  type="checkbox"
                  checked={form.visibility === 'private'}
                  onChange={(event) => setForm({ ...form, visibility: event.target.checked ? 'private' : 'public' })}
                />
                <span className="form-check-label small">Post privado</span>
              </label>
            </div>

            <div className="teachgram-modal__actions">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Avancar
              </button>
            </div>
          </form>
        ) : (
          <form className="teachgram-modal__stack" onSubmit={handleSubmit}>
            <div className="teachgram-compose">
              <div className="teachgram-compose__bar">
                <button type="button" className="teachgram-compose__back" onClick={() => setStep('link')}>
                  ←
                </button>
                <button type="submit" className="teachgram-compose__share" disabled={loading}>
                  {loading ? 'Enviando' : 'Compartilhar'}
                </button>
              </div>

              <img src={form.resourceLink || heroImg} alt="Previa da publicacao" className="teachgram-compose__image" />

              <input
                className="form-control form-control-sm"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Titulo da publicacao"
              />

              <textarea
                className="teachgram-compose__caption"
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Escreva uma legenda..."
              />

              <div className="teachgram-modal__actions teachgram-modal__actions--start">
                <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setStep('link')}>
                  Voltar
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
