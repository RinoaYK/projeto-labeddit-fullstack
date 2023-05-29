import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { goToSignUp } from '../routes/coordinator.js'
import { useForm } from '../hooks/useForm.js'
import useRequestData from '../hooks/useRequestData.js'
import {
  Flex,
  FormControl,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  InputRightElement,
  InputGroup,
  Text,
  Image,
  Divider,
  chakra,
  useToast,
  Icon
} from '@chakra-ui/react'
import { ViewOffIcon, ViewIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { HashLoader } from 'react-spinners'
import logo from '../images/Logo_big.svg'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

function LoginPage () {
  const AnimatedButton = chakra(motion.button)
  const toast = useToast()
  const navigate = useNavigate()
  const { form, onChangeForm, setForm } = useForm({
    email: '',
    password: ''
  })
  const path = '/users/login'
  const { recebeDados, error, isLoading } =
    useRequestData(path, form)
  const [errorFill, setErrorFill] = useState(false)

  const [rememberMe, setRememberMe] = useState(false)

  const handleClick = event => {
    event.preventDefault()
    Cookies.set('emailUserLabeddit', form.email, { expires: 7 })

    if (rememberMe) {
      localStorage.setItem('rememberMe', JSON.stringify(rememberMe))
      Cookies.set('emailLabeddit', form.email, { expires: 7 })
      Cookies.set('passwordLabeddit', form.password, { expires: 7 })
    }

    if (form.email === '' || form.password === '') {
      setErrorFill(true)
      toast({
        title: "'email' ou 'senha' incorretos!",
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3500
      })
      return
    }

    if (form.email !== '') {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) {
        setErrorFill(true)
        toast({
          title: "'email' ou 'senha' incorretos!",
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
          title: "'email' ou 'senha' incorretos!",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3500
        })
        setForm(prevForm => ({ ...prevForm, password: '' }))
        return
      }
    }
    recebeDados()
  }

  const [showPassword, setShowPassword] = useState(false)
  const handlePassword = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    const storedValue = localStorage.getItem('rememberMe')

    if (storedValue) {
      setRememberMe(JSON.parse(storedValue))
      const savedEmail = Cookies.get('emailLabeddit')
      const savedPassword = Cookies.get('passwordLabeddit')
      setForm(prevForm => ({ ...prevForm, email: savedEmail }))
      setForm(prevForm => ({ ...prevForm, password: savedPassword }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Flex
      minH={'100vh'}
      maxW={'100vw'}
      justifyContent='center'
      alignItems='center'
    >
      {!isLoading ? (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} maxH={'sd'}>
          <Flex
            direction='column'
            justifyContent='center'
            alignItems='center'
            p={8}
            w='27em'
            h='100vh'
          >
            <Stack align={'center'} mb='6em'>
              <Image src={logo} />
              <Heading
                fontSize='36px'
                fontWeight='700'
                lineHeight='46.8px'
                fontFamily='ibm'
              >
                LabEddit
              </Heading>
              <Text
                fontSize='16px'
                fontWeight='400'
                lineHeight='21px'
                fontFamily='ibm'
              >
                O projeto de rede social da Labenu
              </Text>
            </Stack>

            <FormControl>
              <Flex justifyContent='center' alignItems='center' flexWrap='wrap'>
                <Input
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

                <Checkbox
                  position='absolute'
                  left='1em'
                  top='9em'
                  colorScheme='orange'
                  isChecked={rememberMe}
                  onChange={e => {
                    if (e.target.checked) {
                      setRememberMe(true)
                    } else {
                      setRememberMe(false)
                      Cookies.remove('emailLabeddit')
                      Cookies.remove('passwordLabeddit')
                      localStorage.removeItem('rememberMe')
                      setForm(prevForm => ({ ...prevForm, email: '' }))
                      setForm(prevForm => ({ ...prevForm, password: '' }))
                    }
                  }}
                >
                  Remember me
                </Checkbox>
              </Flex>

              <Flex
                spacing={15}
                mt='5em'
                direction='column'
                justifyContent='center'
                alignItems='center'
                gap='0.5em'
              >
                <AnimatedButton
                  bgGradient='linear-gradient(90deg, #FF7264, #F9B24E)'
                  color={'white'}
                  _hover={{
                    bgGradient: 'linear-gradient(90deg, #A8BBC6, #45525B)'
                  }}
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
                  Continuar
                </AnimatedButton>
                <Divider
                  w='22em'
                  h='1px'
                  bgGradient='linear-gradient(90deg, #FF7264, #F9B24E)'
                  my='2'
                />

                <Button
                  onClick={() => goToSignUp(navigate)}
                  borderRadius='27px'
                  bg='white'
                  border='1px solid #FE7E02'
                  color='#FE7E02'
                  fontFamily='noto'
                  fontSize='18px'
                  fontWeight='700'
                  lineHeight='25px'
                  w='19em'
                  h='3.1875em'
                  _hover={{
                    bg: '#A8BBC6',
                    color: '#45525B',
                    border: '1px solid #45525B'
                  }}
                >
                  Crie uma conta!
                </Button>
              </Flex>
            </FormControl>
          </Flex>
        </Stack>
      ) : (
        <Flex direction='column' align='center' gap='2em'>
          <Text
            fontSize='38px'
            fontWeight='800'
            lineHeight='43px'
            fontFamily='ibm'
            color='#028FCC'
          >
            Logando, tenha paciência!
          </Text>
          <HashLoader color='#028FCC' />
        </Flex>
      )}
    </Flex>
  )
}

export default LoginPage
