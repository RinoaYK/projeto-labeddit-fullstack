import { useState } from 'react'
import axios from 'axios'
import { baseURL } from '../constants/baseURL.js'
import { useToast } from '@chakra-ui/react'
import Cookies from 'js-cookie'

export default function useRequestPosts (path, form) {  
  const toast = useToast()
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const token = Cookies.get('token')
  const headers = {
    headers: {
      Authorization: token
    }
  }
  const postPostsComments = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${baseURL}${path}`, form, headers)
      setIsLoading(false)      
    } catch (error) {
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

  return { postPostsComments, error, isLoading, setError,setIsLoading }
}
