import { useState } from 'react'
import { useForm } from '../hooks/useForm'
import useRequestData from '../hooks/useRequestData'
import {
  Flex,
  Box,
  FormControl,
  Input,
  Stack,
  Heading,
  InputRightElement,
  InputGroup,
  Text,
  Checkbox,
  useBreakpointValue,
  chakra,
  useToast,
  Tooltip,
  Icon,
  Button,
  Image,
  Grid
} from '@chakra-ui/react'
import { ViewOffIcon, ViewIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { HashLoader } from 'react-spinners'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'
import logoM from '../../src/images/Logo_menor.svg'
import { goToLogin } from '../routes/coordinator'
import { useNavigate } from 'react-router-dom'

function SignUpPage () {
  const navigate = useNavigate()
  const AnimatedButton = chakra(motion.button)
  const toast = useToast()
  const { form, onChangeForm, setForm } = useForm({
    nickname: '',
    email: '',
    password: ''
  })
  const path = '/users/signup'
  const { recebeDados, isLoading, error } = useRequestData(path, form)
  const [errorFill, setErrorFill] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = event => {
    event.preventDefault()

    if (form.nickname === '' || form.email === '' || form.password === '') {
      setErrorFill(true)
      toast({
        title: 'Por favor, preencha todos os campos e marque o checkbox.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3500
      })
      return
    }

    if (form.nickname !== '') {
      if (!/^[a-zA-Z]{5,}$/.test(form.nickname)) {
        setErrorFill(true)
        toast({
          title:
            "'nickname' deve ter pelo menos 5 caracteres, sem espaços e sem caracteres especiais.",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3500
        })
        return
      }
    }

    if (form.email !== '') {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) {
        setErrorFill(true)
        toast({
          title: "'email' inválido!",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 1500
        })
        setForm(prevForm => ({ ...prevForm, email: '' }))
        return
      }
    }

    if (form.password !== '') {
      if (!/^(?=.*[A-Za-z]{5})(?=.*\d{2}).{7,}$/.test(form.password)) {
        setErrorFill(true)
        toast({
          title:
            "'password' deve ter pelo menos 7 caracteres, incluindo pelo menos 2 números e 5 letras.",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3500
        })
        setForm(prevForm => ({ ...prevForm, password: '' }))
        return
      }
    }
    if (!checkboxChecked) {
      setErrorFill(true)
      setShowTooltip(true)
      setTimeout(() => {
        setShowTooltip(false)
      }, 2000)
      return
    }

    Cookies.set('emailLabeddit', form.email, { expires: 7 })
    recebeDados()    
  }

  const [showPassword, setShowPassword] = useState(false)
  const handlePassword = () => {
    setShowPassword(!showPassword)
  }
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const marginBottom = useBreakpointValue({ base: '1em', smm: '6em' })
  const marginTop = useBreakpointValue({ base: '2em', smm: '0' })

  return (
    <Flex
      minH={'100vh'}
      maxW={'100vw'}
      justifyContent='center'
      alignItems='center'
    >
      <Grid
        position='absolute'
        top='0em'
        width='100vw'
        align='center'
        justify='center'
        templateColumns='auto auto auto'
        justifyContent='space-between'
        alignItems='center'
        height='50px'
        bg='#EDEDED'
        pl='1em'
        pr='1em'
      >
        <Box w='5em' gridColumn='1' justifySelf='flex-start' />

        <Image src={logoM} gridColumn='2' justifySelf='center' />

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
      </Grid>

      {!isLoading ? (
        <Flex
          direction='column'
          justifyContent='center'
          alignItems='center'
          p={8}
          h='100vh'
          w='100vw'
        >
          <Stack align={'center'} mt={marginTop} mb={marginBottom}>
            <Heading
              fontSize='33px'
              fontWeight='700'
              lineHeight='43px'
              fontFamily='ibm'
            >
              Olá, boas vindas ao LabEddit ;)
            </Heading>
          </Stack>
          <Stack spacing={4}>
            <FormControl>
              <Flex
                direction='column'
                justifyContent='center'
                alignItems='center'
              >
                <Input
                  fontFamily='noto'
                  htmlFor='nickname'
                  placeholder='Apelido'
                  id='nickname'
                  isRequired
                  name={'nickname'}
                  value={form.nickname}
                  onChange={onChangeForm}
                  h='3.75em'
                  w='21em'
                />
                <Input
                  mt='1em'
                  fontFamily='noto'
                  htmlFor='email'
                  placeholder='E-mail'
                  type='email'
                  id='email'
                  isRequired
                  name='email'
                  value={form.email}
                  onChange={onChangeForm}
                  h='3.75em'
                  w='21em'
                />
                <InputGroup mt='1em' htmlFor='password' w='21em'>
                  <Input
                    fontFamily='noto'
                    placeholder='Senha'
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    isRequired
                    name='password'
                    value={form.password}
                    onChange={onChangeForm}
                    h='3.75em'
                  />
                  <InputRightElement
                    h='3.75em'
                    children={
                      !showPassword ? (
                        <ViewOffIcon
                          onClick={handlePassword}
                          color='rgb(211, 211, 211)'
                          cursor='pointer'
                          _hover={{
                            color: 'grey'
                          }}
                        />
                      ) : (
                        <ViewIcon
                          color='rgb(211, 211, 211)'
                          cursor='pointer'
                          onClick={handlePassword}
                          _hover={{
                            color: 'grey'
                          }}
                        />
                      )
                    }
                  />
                </InputGroup>
              </Flex>
              <Flex
                direction='column'
                justifyContent='center'
                alignItems='center'
              >
                <Box display='inline-block' mt='3.5em'>
                  <Text
                    fontSize='14px'
                    fontWeight='400'
                    lineHeight='19px'
                    fontFamily='noto'
                  >
                    Ao continuar, você concorda com o nosso{' '}
                    <Text as='span' color='#4088CB' fontWeight='500'>
                      Contrato de usuário
                    </Text>{' '}
                    e nossa{' '}
                    <Text as='span' color='#4088CB' fontWeight='500'>
                      Política de Privacidade
                    </Text>
                  </Text>
                </Box>
                <Tooltip
                  placement='top'
                  hasArrow
                  label='Marque o checkbox para continuar.'
                  isOpen={showTooltip}
                  mb='1em'
                  ml='1em'
                  bg='red'
                >
                  <Checkbox
                    colorScheme='orange'
                    mt='1.5em'
                    fontSize='14px'
                    fontWeight='400'
                    lineHeight='19px'
                    fontFamily='noto'
                    isChecked={checkboxChecked}
                    onChange={e => setCheckboxChecked(e.target.checked)}
                  >
                    <Text ml='0.2em'>
                      Eu concordo em receber emails sobre coisas legais no
                      Labeddit
                    </Text>
                  </Checkbox>
                </Tooltip>
                <Stack spacing={5}>
                  <AnimatedButton
                    bgGradient='linear-gradient(90deg, #FF6489, #F9B24E)'
                    color={'white'}
                    _hover={{
                      bgGradient: 'linear-gradient(90deg, #A8BBC6, #45525B)'
                    }}
                    mt='2.5em'
                    type='submit'
                    onClick={handleClick}
                    borderRadius='27px'
                    fontFamily='noto'
                    fontSize='18px'
                    fontWeight='700'
                    lineHeight='25px'
                    w='19em'
                    h='3.1875em'
                    animate={
                      errorFill || error
                        ? {
                            x: [-10, 10, -10, 0],
                            transition: { duration: 0.4 }
                          }
                        : {}
                    }
                    onAnimationComplete={() => setErrorFill(false)}
                  >
                    {errorFill || error ? (
                      <Icon as={WarningTwoIcon} mr='0.5em' />
                    ) : null}
                    Cadastrar
                  </AnimatedButton>
                </Stack>
              </Flex>
            </FormControl>
          </Stack>
        </Flex>
      ) : (
        <Flex direction='column' align='center' gap='2em'>
          <Text
            fontSize='38px'
            fontWeight='800'
            lineHeight='43px'
            fontFamily='ibm'
            color='#028FCC'
          >
            Criando a conta, tenha paciência!
          </Text>
          <HashLoader color='#028FCC' />
        </Flex>
      )}
    </Flex>
  )
}

export default SignUpPage
