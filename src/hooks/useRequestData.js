import { useState } from 'react'
import axios from 'axios'
import { baseURL } from '../constants/baseURL.js'
import { goToPosts } from '../routes/coordinator'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import Cookies from 'js-cookie'

export default function useRequestData (path, form) {
  const toast = useToast()
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const isLogin = location.pathname === '/'
  const isSignup = location.pathname === '/signup'

  const recebeDados = async () => {
    setIsLoading(true)
    try {
      await axios.post(`${baseURL}${path}`, form).then(res => {
        if (isLogin || isSignup) {
          Cookies.set('token', res.data.token)
        }
        setIsLoading(false)
        goToPosts(navigate)
        window.location.reload();
      })
    } catch (error) {
      setIsLoading(false)
      toast({
        title: error.response.data,
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3500
      })
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3500)
    }
  }

  return { recebeDados, error, isLoading, setError, setIsLoading }
}
