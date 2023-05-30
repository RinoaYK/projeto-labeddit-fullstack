import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { goToLogin } from '../routes/coordinator'
import Cookies from 'js-cookie'

const useProtectPage = () => {
  const navigate = useNavigate()
  const token = Cookies.get('token')
  useEffect(() => {
    if (!token) {
      goToLogin(navigate)
    }
  }, [token, navigate])
}
export default useProtectPage
