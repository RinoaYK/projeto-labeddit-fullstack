import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoM from '../../src/images/Logo_menor.svg'
import buttonX from '../../src/images/buttonX.svg'
import buttonXblue from '../../src/images/buttonXblue.svg'
import { goToEditUser, goToLogin, goToPosts } from '../routes/coordinator'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { baseURL } from '../constants/baseURL'
import axios from 'axios'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isLogin = location.pathname === '/'
  const isSignup = location.pathname === '/signup'
  const isPosts = location.pathname === '/posts'
  const isComments = location.pathname.startsWith('/comments/')
  const isEditUser = location.pathname === '/user'

  const logout = () => {
    localStorage.removeItem('token')
    Cookies.remove('emailUserLabeddit')  
    goToLogin(navigate)
  }

  const toast = useToast()
  const token = localStorage.getItem('token')
  const headers = {
    headers: {
      Authorization: token
    }
  }

  const path = '/users'

  const savedEmail = Cookies.get('emailUserLabeddit')

  const [userAvatar, setUserAvatar] = useState('')
  const [userNickname, setUserNickname] = useState(null)

  const findUser = async () => {
    try {
      const response = await axios.get(`${baseURL}${path}`, headers)
      const filteredData = response.data.filter(obj => obj.email === savedEmail)

      if (filteredData[0]) {
        setUserNickname(filteredData[0].nickname)
        setUserAvatar(filteredData[0].avatar)
      }
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

  useEffect(() => {
    findUser()    

     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isHoveredDeleteIcon, setIsHoveredDeleteIcon] = useState(false)

  return (
    <Box
      display={
        isSignup || isPosts || isComments || isEditUser ? 'flex' : 'none'
      }
    >
    <Flex
         position='absolute'
        top='0em'
        width='100vw'
        align='center'
        justify='center'
        display={isLogin ? 'none' : 'flex'}
      >
        <Grid
          templateColumns='auto auto auto'
          justifyContent='space-between'
          alignItems='center'
          width='100%'
          height='50px'
          bg='#EDEDED'
          pl='1em'
          pr='1em'
        >
          {isComments || isEditUser ? (
            <Tooltip
              label='voltar'
              placement='right'
              bg='#4088CB'
              ml='0.2em'
              hasArrow
            >
            <Image
                gridColumn='1'
                justifySelf='flex-start'
                w={5}
                h={5}
                src={isHoveredDeleteIcon ? buttonXblue : buttonX}
                _hover={{
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setIsHoveredDeleteIcon(true)}
                onMouseLeave={() => setIsHoveredDeleteIcon(false)}
                onClick={() => {
                  goToPosts(navigate)
                  setIsHoveredDeleteIcon(false)
                }}
              />
            </Tooltip>
          ) : isPosts ? (
            <Tooltip
              label='Editar usuário'
              placement='right'
              bg='#FF7264'
              ml='0.2em'
              hasArrow
            >
              <Flex
                direction='row'
                alignItems='center'
                justifyContent='center'
                gap='0.5em'
                onClick={() => goToEditUser(navigate)}
                _hover={{
                  cursor: 'pointer',
                  fontWeight: '800'
                }}
                fontWeight='500'
                rounded={10}
                zIndex={'docked'}
              >
                <Image
                  src={userAvatar}
                  boxSize='35px'
                  borderRadius='50%'
                  bg='white'
                />
                <Text fontSize='15px' lineHeight='25px' fontFamily='noto'>
                  {userNickname}
                </Text>
              </Flex>
            </Tooltip>
          ) : (
            <Box w='5em' gridColumn='1' justifySelf='flex-start' />
          )}
          <Image
            src={logoM}
            gridColumn='2'
            justifySelf='center'
            ml={isComments ? '3em' : '0em'}
          />
          {isSignup ? (
            <Button
              bg='none'
              _hover={{
                bg: 'transparent',
                fontWeight: '700'
              }}
              fontSize='18px'
              fontWeight='600'
              lineHeight='25px'
              fontFamily='noto'
              color='#4088CB'
              gridColumn='3'
              justifySelf='flex-end'
              onClick={() => goToLogin(navigate)}
            >
              Entrar
            </Button>
          ) : isPosts || isComments ? (
            <Button
              bg='none'
              _hover={{
                bg: 'transparent',
                fontWeight: '700'
              }}
              fontSize='18px'
              fontWeight='600'
              lineHeight='25px'
              fontFamily='noto'
              color='#4088CB'
              gridColumn='3'
              justifySelf='flex-end'
              onClick={logout}
              zIndex='docked'
            >
              Logout
            </Button>
          ) : null}
        </Grid>
  </Flex>
    </Box>
  )
}
export default Header
