import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { User as AuthUser } from '../models/User'
import { Modal } from '../components/Modal'
import heroImg from '../assets/hero.png'

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
  const [showModal, setShowModal] = useState(true)
  const [step, setStep] = useState<'link' | 'compose'>('link')
  const [message, setMessage] = useState('')

  const previewTitle = form.title || 'Título da sua publicação'
  const previewDescription =
    form.description ||
    'Escreva uma ideia, compartilhe um material ou descreva uma prática que pode inspirar outras pessoas.'

  const previewTag = useMemo(
    () => (form.visibility === 'private' ? 'Privado' : 'Público'),
    [form.visibility],
  )

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('Sua publicação foi preparada com sucesso para a comunidade.')
    setForm(initialValues)
    setStep('link')
    closeModal()
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
            <p className="section-eyebrow">Novo conteúdo</p>
            <h2>Monte uma nova publicação</h2>
          </div>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowModal(true)}>
            Abrir modal
          </button>
        </div>

        <div className="compose-page__hint alert alert-light border small mb-0">
          O fluxo abaixo abre como modal, igual ao Figma. Se preferir, use o botão para reabrir.
        </div>

        {message ? <div className="auth-alert auth-alert--success mt-3">{message}</div> : null}

        <div className="content-panel content-panel--nested mt-3">
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
        </div>
      </section>

      <Modal
        open={showModal}
        title="Criar nova publicação"
        subtitle={step === 'link' ? 'Adicione um link para começar' : 'Escreva o conteúdo da postagem'}
        onClose={closeModal}
        size={step === 'link' ? 'sm' : 'lg'}
      >
        {step === 'link' ? (
          <form className="d-grid gap-3" onSubmit={handleNext}>
            <input
              className="form-control form-control-sm"
              value={form.resourceLink}
              onChange={(event) => setForm({ ...form, resourceLink: event.target.value })}
              placeholder="Cole um link ou recurso"
            />

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Avançar
              </button>
            </div>
          </form>
        ) : (
          <form className="d-grid gap-3" onSubmit={handleSubmit}>
            <div className="text-center">
              <img
                src={heroImg}
                alt="Prévia da publicação"
                className="img-fluid rounded-4 shadow-sm"
              />
            </div>

            <input
              className="form-control form-control-sm"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Escreva uma legenda..."
            />

            <textarea
              className="form-control form-control-sm"
              rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Detalhe sua publicação"
            />

            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
              <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setStep('link')}>
                Voltar
              </button>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Compartilhar
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
