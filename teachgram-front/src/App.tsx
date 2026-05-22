import './App.css'
import { LoginForm } from './components/LoginForm'
import heroImg from './assets/hero.png'

function App() {
  return (
    <main className="auth-page">
      <div className="auth-backdrop auth-backdrop--one" />
      <div className="auth-backdrop auth-backdrop--two" />

      <section className="auth-shell" aria-label="Área de autenticação">
        <div className="auth-card">
          <div className="auth-content">
            <div className="auth-form-panel">
              <LoginForm />
            </div>
            <div className="auth-illustration" aria-hidden="true">
              <div className="auth-illustration__glow auth-illustration__glow--one" />
              <div className="auth-illustration__glow auth-illustration__glow--two" />
              <img src={heroImg} alt="" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
