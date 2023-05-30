import axios from 'axios'
import { baseURL } from '../constants/baseURL.js'
import { useToast } from '@chakra-ui/react'
import { headers, useAuthorizationHeader } from './useAuthorizationHeader.js'

export default function useDelete () {
  const toast = useToast()
  useAuthorizationHeader()

  const deletePostComment = async (path, idToDelete) => {    
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

  return {deletePostComment}
}
