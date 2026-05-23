import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '../components/Logo'



export const LoadingPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/feed', { replace: true })
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="loading-page">
      <div className="loading-page__content d-flex flex-column align-items-center gap-3">
        <Logo className="loading-page__brand" />
        <p className="loading-page__status">Carregando...</p>
      </div>
    </main>
  )
}
