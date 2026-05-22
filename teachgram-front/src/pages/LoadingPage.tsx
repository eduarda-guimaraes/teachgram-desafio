import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User as AuthUser } from '../models/User'
import logoImg from '../assets/logo.png'

interface LoadingPageProps {
  currentUser: AuthUser | null
}

export const LoadingPage = ({ currentUser }: LoadingPageProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/feed', { replace: true })
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="loading-page">
      <div className="loading-page__card">
        <img className="loading-page__brand" src={logoImg} alt="Teachgram" />
        <p className="loading-page__status">Carregando...</p>
        <small>{currentUser?.name ?? 'Teachgram'}</small>
      </div>
    </main>
  )
}
