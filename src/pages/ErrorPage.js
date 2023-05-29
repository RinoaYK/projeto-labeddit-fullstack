import { Button, Flex, Image } from '@chakra-ui/react'
import errorPageImage from '../images/errorPage.svg'
import { useNavigate } from 'react-router-dom'
import { goToLogin } from '../routes/coordinator'

function ErrorPage () {
  const navigate = useNavigate()
  return (
    <Flex
      minH={'100vh'}
      maxW={'100vw'}
      justifyContent='center'
      alignItems='center'
      direction='column'
      p='5em'
    >
      <Flex justifyContent='center' alignItems='center' direction='column'>
        <Image
          src={errorPageImage}
          alt='Página de erro'
          maxW={'100vw'}
          h='80vh'
          mt='-5em'
        />
        <Button mt='-2em' onClick={() => goToLogin(navigate)}>
          {' '}
          Voltar pro Login
        </Button>
      </Flex>
    </Flex>
  )
}

export default ErrorPage
