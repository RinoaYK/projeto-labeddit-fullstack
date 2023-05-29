import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { goToLogin } from '../routes/coordinator'

const useProtectPage = () => {
  const navigate = useNavigate()
  const token = window.localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      goToLogin(navigate)
    }
  }, [token, navigate])
}
export default useProtectPage
