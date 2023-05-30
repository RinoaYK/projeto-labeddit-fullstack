import axios from 'axios'
import { baseURL } from '../constants/baseURL.js'
import { useToast } from '@chakra-ui/react'
import Cookies from 'js-cookie'

export default function useDelete (path, idToDelete) {
  const toast = useToast()
  const token = Cookies.getItem('token')
  const headers = {
    headers: {
      Authorization: token
    }
  }
  const deletePostComment = async () => {
    try {
      await axios.delete(`${baseURL}${path}/${idToDelete}`, headers)
    } catch (error) {
      toast({
        title: error.response.data,
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3500
      })
    }
  }

  return deletePostComment
}
