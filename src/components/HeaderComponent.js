import {
  Box,
  Button,
  Grid,
  Image,  
  Tooltip,  
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoM from '../../src/images/Logo_menor.svg'
import buttonX from '../../src/images/buttonX.svg'
import buttonXblue from '../../src/images/buttonXblue.svg'
import { goToLogin, goToPosts } from '../routes/coordinator'
import Cookies from 'js-cookie'
import { useState } from 'react'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()  
  const isSignup = location.pathname === '/signup'
  const isPosts = location.pathname === '/posts'
  const isComments = location.pathname.startsWith('/comments/')
  const isEditUser = location.pathname === '/user'

  const [isHoveredDeleteIcon, setIsHoveredDeleteIcon] = useState(false)

  const logout = () => {
    Cookies.remove('token')
    goToLogin(navigate)    
  }

  return (
    <Grid
      display={
        isSignup || isPosts || isComments || isEditUser ? 'grid' : 'none'
      }
      position='absolute'
      top='0em'
      templateColumns='auto auto auto'
      justifyContent='space-between'
      alignItems='center'
      width='100%'
      height='50px'
      bg='#EDEDED'
      pl='1em'
      pr='1em'
    >
      {/* grid 1 */}
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
      )  : (
        <Box w='5em' gridColumn='1' justifySelf='flex-start' />
      )}

      {/* grid 2 */}
      <Image
        src={logoM}
        gridColumn='2'
        justifySelf='center'
        ml={isComments || isEditUser? '3em' : '0em'}
      />

      {/* grid 3 */}
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
      ) :   <Box w='5em' gridColumn='3' justifySelf='flex-start' />}
    </Grid>
  )
}
export default Header
