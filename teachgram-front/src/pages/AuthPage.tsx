import bannerImg from '../assets/banner.png'
import { LoginForm } from '../components/LoginForm'
import type { AuthResponse } from '../types'

interface AuthPageProps {
  initialMode?: 'login' | 'register'
  onAuthenticated: (auth: AuthResponse) => void
}

export const AuthPage = ({ initialMode = 'login', onAuthenticated }: AuthPageProps) => {
  return (
    <main className="auth-page" aria-label="Área de autenticação">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-content">
            <div className="auth-form-panel">
              <LoginForm initialMode={initialMode} onAuthenticated={onAuthenticated} />
            </div>
            <div className="auth-illustration">
              <img src={bannerImg} alt="Banner Teachgram" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


