import { useEffect, useState, type FormEvent } from 'react'
import { loginUser, registerUser } from '../services/authService'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types'
import Logo from '../components/Logo'

type AuthMode = 'login' | 'register'

type FormState = {
  name: string
  email: string
  username: string
  bio: string
  phone: string
  password: string
  confirmPassword: string
}

const initialFormState: FormState = {
  name: '',
  email: '',
  username: '',
  bio: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

interface LoginFormProps {
  initialMode?: AuthMode
  onAuthenticated?: (auth: AuthResponse) => void
}

export const LoginForm = ({ initialMode = 'login', onAuthenticated }: LoginFormProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [form, setForm] = useState<FormState>(initialFormState)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMode(initialMode)
    setErrorMessage('')
    setSuccessMessage('')
    setErrors({})
    setForm(initialFormState)
  }, [initialMode])

  const updateField = (field: keyof FormState) => (value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    // Clear field-specific error when user types
    if (errors[field]) {
      setErrors((current) => {
        const updated = { ...current }
        delete updated[field]
        return updated
      })
    }
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setErrorMessage('')
    setSuccessMessage('')
    setErrors({})
    setForm((current) => ({
      ...current,
      password: '',
      confirmPassword: '',
    }))
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    const auth = await loginUser(credentials)
    setSuccessMessage(`Bem-vindo, ${auth.user.name ?? auth.user.username}.`)
    onAuthenticated?.(auth)
    return auth
  }

  const handleRegister = async (credentials: RegisterCredentials) => {
    const auth = await registerUser(credentials)
    setErrorMessage('')
    setSuccessMessage('Conta criada com sucesso. Bem-vindo ao Teachgram.')
    onAuthenticated?.(auth)
    return auth
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    setErrors({})

    const validationErrors: Record<string, string> = {}

    if (mode === 'login') {
      if (!form.email.trim()) {
        validationErrors.email = 'Campo não preenchido'
      }
      if (!form.password) {
        validationErrors.password = 'Campo não preenchido'
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setLoading(false)
        return
      }

      try {
        await handleLogin({
          email: form.email.trim(),
          password: form.password,
        })
      } catch (err: any) {
        setErrors({ password: 'Senha incorreta' })
      } finally {
        setLoading(false)
      }
      return
    }

    // Register mode validation
    if (!form.name.trim()) {
      validationErrors.name = 'Campo não preenchido'
    }
    if (!form.email.trim()) {
      validationErrors.email = 'Campo não preenchido'
    }
    if (!form.username.trim()) {
      validationErrors.username = 'Campo não preenchido'
    }
    if (!form.bio.trim()) {
      validationErrors.bio = 'Campo não preenchido'
    }
    if (!form.phone.trim()) {
      validationErrors.phone = 'Campo não preenchido'
    }
    if (!form.password) {
      validationErrors.password = 'Campo não preenchido'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      await handleRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        bio: form.bio.trim() || undefined,
      })
    } catch (err: any) {
      const msg = err.response?.data?.message || ''
      if (msg.includes('Username') || msg.toLowerCase().includes('username')) {
        setErrors({ username: 'Username já está em uso.' })
      } else if (msg.includes('Email') || msg.toLowerCase().includes('email')) {
        setErrors({ email: 'Email já está em uso.' })
      } else if (msg.includes('Telefone') || msg.toLowerCase().includes('telefone') || msg.includes('phone')) {
        setErrors({ phone: 'Telefone já está em uso.' })
      } else {
        setErrorMessage('Não foi possível criar a conta. Verifique os dados e tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-form-shell w-100 animate-fade-in">
      <div className="auth-brand text-start">
        <Logo className="auth-brand__logo img-fluid" />
      </div>

      <form className="auth-form d-grid gap-3" onSubmit={handleSubmit}>
        <header className="auth-form__header">
          <h2 className="fw-bold mb-0">{mode === 'login' ? 'Faça seu login' : 'Crie sua conta'}</h2>
        </header>

        <div className="d-grid gap-2">
          {mode === 'register' ? (
            <>
              <div className="form-group mb-1">
                <label className="form-label small fw-bold mb-1">Nome</label>
                <input
                  className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`}
                  autoComplete="name"
                  placeholder="Digite seu nome"
                  value={form.name}
                  onChange={(e) => updateField('name')(e.target.value)}
                />
                {errors.name && (
                  <div className="field-error">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="form-group mb-1">
                <label className="form-label small fw-bold mb-1">E-mail</label>
                <input
                  className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                  autoComplete="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email')(e.target.value)}
                />
                {errors.email && (
                  <div className="field-error">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group mb-1">
                <label className="form-label small fw-bold mb-1">Username</label>
                <input
                  className={`form-control form-control-sm ${errors.username ? 'is-invalid' : ''}`}
                  autoComplete="username"
                  placeholder="@ seu_username"
                  value={form.username}
                  onChange={(e) => updateField('username')(e.target.value)}
                />
                {errors.username && (
                  <div className="field-error">
                    {errors.username}
                  </div>
                )}
              </div>

              <div className="form-group mb-1">
                <label className="form-label small fw-bold mb-1">Descrição</label>
                <input
                  className={`form-control form-control-sm ${errors.bio ? 'is-invalid' : ''}`}
                  placeholder="Faça uma descrição"
                  value={form.bio}
                  onChange={(e) => updateField('bio')(e.target.value)}
                />
                {errors.bio && (
                  <div className="field-error">
                    {errors.bio}
                  </div>
                )}
              </div>

              <div className="form-group mb-1">
                <label className="form-label small fw-bold mb-1">Celular</label>
                <input
                  className={`form-control form-control-sm ${errors.phone ? 'is-invalid' : ''}`}
                  autoComplete="tel"
                  placeholder="Digite seu número de celular"
                  value={form.phone}
                  onChange={(e) => updateField('phone')(e.target.value)}
                />
                {errors.phone && (
                  <div className="field-error">
                    {errors.phone}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="form-group mb-1">
              <label className="form-label small fw-bold mb-1">E-mail</label>
              <input
                className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                autoComplete="email"
                placeholder="Digite seu e-mail"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email')(e.target.value)}
              />
              {errors.email && (
                <div className="field-error">
                  {errors.email}
                </div>
              )}
            </div>
          )}

          <div className="form-group mb-1">
            <label className="form-label small fw-bold mb-1">Senha</label>
            <input
              className={`form-control form-control-sm ${errors.password ? 'is-invalid' : ''}`}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Digite sua senha"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password')(e.target.value)}
            />
            {errors.password && (
              <div className="field-error">
                {errors.password}
              </div>
            )}
          </div>
        </div>

        {mode === 'login' ? (
          <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap auth-form__row">
            <label className="form-check d-flex align-items-center gap-2 mb-0 custom-checkbox-label">
              <input className="form-check-input m-0 custom-checkbox" type="checkbox" />
              <span className="form-check-label small">Lembrar senha</span>
            </label>

            <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none forgot-password-btn">
              Esqueci minha senha
            </button>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="alert alert-danger py-2 mb-0 small" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="alert alert-success py-2 mb-0 small" role="status">
            {successMessage}
          </div>
        ) : null}

        <button className="btn btn-primary btn-submit w-100 fw-semibold" type="submit" disabled={loading}>
          {loading ? (mode === 'login' ? 'Entrando...' : 'Criando conta...') : mode === 'login' ? 'Entrar' : 'Próximo'}
        </button>

        {mode === 'login' ? (
          <>
            <div className="auth-divider">
              <span>Entrar com</span>
            </div>

            <div className="social-buttons d-grid gap-2">
              <button type="button" className="social-button btn-google">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Entrar com Google</span>
              </button>
              <button type="button" className="social-button btn-apple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                </svg>
                <span>Entrar com Apple</span>
              </button>
            </div>
          </>
        ) : null}

        <p className="auth-form__footer text-center small mb-0">
          {mode === 'login' ? (
            <>
              Não possui conta?{' '}
              <button type="button" className="btn btn-link btn-sm p-0 align-baseline register-link-btn" onClick={() => switchMode('register')}>
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já possui conta?{' '}
              <button type="button" className="btn btn-link btn-sm p-0 align-baseline login-link-btn" onClick={() => switchMode('login')}>
                Entrar
              </button>
            </>
          )}
        </p>
      </form>
    </section>
  )
}

