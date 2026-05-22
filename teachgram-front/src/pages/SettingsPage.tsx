import { useState, type FormEvent } from 'react'
import type { User as AuthUser } from '../models/User'
import { Modal } from '../components/Modal'

interface SettingsPageProps {
  currentUser: AuthUser | null
}

export const SettingsPage = ({ currentUser }: SettingsPageProps) => {
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    username: currentUser?.username ?? '',
    email: currentUser?.email ?? '',
    bio: currentUser?.bio ?? '',
  })
  const [notifications, setNotifications] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [message, setMessage] = useState('')
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('Configurações salvas com sucesso.')
  }

  return (
    <div className="page-layout page-layout--settings">
      <section className="content-panel content-panel--wide">
        <div className="content-panel__header">
          <div>
            <p className="section-eyebrow">Conta</p>
            <h2>Atualize suas informações</h2>
          </div>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowEditProfile(true)}>
            Editar perfil
          </button>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <label className="field">
              <span>Nome</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="field">
              <span>Username</span>
              <input
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
              />
            </label>
          </div>

          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>

          <label className="field">
            <span>Bio</span>
            <textarea
              rows={5}
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
            />
          </label>

          {message ? <div className="auth-alert auth-alert--success">{message}</div> : null}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setShowDeleteAccount(true)}>
              Excluir conta
            </button>
            <button type="submit" className="primary-button">
              Salvar alterações
            </button>
          </div>
        </form>
      </section>

      <aside className="page-aside">
        <section className="content-panel content-panel--aside">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Preferências</p>
              <h2>Notificações e resumo</h2>
            </div>
          </div>

          <div className="toggle-list">
            <label className="toggle-item">
              <div>
                <strong>Notificações instantâneas</strong>
                <p>Receba alertas quando alguém interagir com suas publicações.</p>
              </div>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            </label>

            <label className="toggle-item">
              <div>
                <strong>Resumo semanal</strong>
                <p>Veja um resumo das suas interações todas as segundas-feiras.</p>
              </div>
              <input type="checkbox" checked={weeklySummary} onChange={() => setWeeklySummary(!weeklySummary)} />
            </label>
          </div>
        </section>

        <section className="content-panel content-panel--aside">
          <div className="content-panel__header">
            <div>
              <p className="section-eyebrow">Segurança</p>
              <h2>Senha e acesso</h2>
            </div>
          </div>

          <div className="stack-card">
            <p>Troque sua senha quando sentir necessidade e revise os dispositivos conectados.</p>
            <button type="button" className="secondary-button secondary-button--full">
              Alterar senha
            </button>
          </div>
        </section>
      </aside>

      <Modal
        open={showEditProfile}
        title="Editar perfil"
        subtitle="Atualize sua foto, nome e bio"
        onClose={() => setShowEditProfile(false)}
        size="sm"
        className="teachgram-modal--profile"
      >
        <form className="teachgram-modal__stack">
          <div className="teachgram-profile-modal__avatar-row">
            <div
              className="teachgram-profile-modal__avatar"
            >
              <span className="fw-semibold">{currentUser?.name?.[0] ?? 'M'}</span>
            </div>
            <div className="teachgram-profile-modal__hint">
              <strong>Foto de perfil</strong>
              <span>https://www.google.com/search?q=...</span>
            </div>
          </div>

          <label className="field">
            <span>Nome</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="field">
            <span>Nome de usuário</span>
            <input
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
            />
          </label>
          <label className="field">
            <span>Bio</span>
            <textarea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
          </label>

          <div className="teachgram-modal__actions">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowEditProfile(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowEditProfile(false)}>
              Atualizar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={showDeleteAccount}
        title="Excluir conta"
        subtitle="Todos os seus dados serão removidos"
        onClose={() => setShowDeleteAccount(false)}
        size="sm"
        className="teachgram-modal--confirm"
      >
        <div className="teachgram-modal__stack teachgram-modal__stack--center">
          <p className="mb-0 small text-muted">Tem certeza que deseja continuar?</p>
          <div className="teachgram-modal__actions teachgram-modal__actions--center">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDeleteAccount(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setShowDeleteAccount(false)}>
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
