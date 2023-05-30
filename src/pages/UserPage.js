import {
  Button,
  Flex,
  FormControl,  
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,  
  chakra,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useProtectPage from '../hooks/useProtectPage'
import { HashLoader } from 'react-spinners'
import { useForm } from '../hooks/useForm'
import { useEffect, useState } from 'react'
import { ViewIcon, ViewOffIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { baseURL } from '../constants/baseURL'
import axios from 'axios'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'
import { goToEditUser } from '../routes/coordinator'
import errorReqImage from '../images/errorReq.gif'
import { headers, useAuthorizationHeader } from '../hooks/useAuthorizationHeader'
import { savedEmail } from '../constants/savedEmail'

function UserPage () {
  useAuthorizationHeader()
  const navigate = useNavigate()
  const AnimatedButton = chakra(motion.button)
  const toast = useToast()

  useProtectPage()
  const [error, setError] = useState(false)
  const [errorReq, setErrorReq] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { form, setForm, onChangeForm } = useForm({
    nickname: '',
    email: '',
    password: '',
    avatar: ''
  })
  const path = '/users'  

  const [userAvatar, setUserAvatar] = useState('')
  const [userId, setUserId] = useState('')
  const [userNickname, setUserNickname] = useState(null)
  const [users, setUsers] = useState([])

  const [loadingFindUser, setLoadingFindUser] = useState(false)

  const findUser = async () => {
    setLoadingFindUser(true)
    try {
      const response = await axios.get(`${baseURL}${path}`, headers)
      const filteredData = response.data.filter(obj => obj.email === savedEmail)
      setUsers(response.data)
      if (filteredData[0]) {
        setUserNickname(filteredData[0].nickname)
        setUserAvatar(filteredData[0].avatar)
        setUserId(filteredData[0].id)
        setLoadingFindUser(false)
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

  const editUser = async form => {
    setIsLoading(true)
    try {
      await axios.put(`${baseURL}${path}/${userId}`, form, headers)
      setIsLoading(false)      
      window.location.reload();
    } catch (error) {
      setErrorReq(true)
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  const handlePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClick = event => {
    event.preventDefault()

    if (form.nickname !== '') {
      const nicknameExists = users.find(user => user.nickname === form.nickname)

      if (nicknameExists) {
        setError(true)
        toast({
          title: "Esse 'nickname' já existe!",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 1500
        })
        setForm(prevForm => ({ ...prevForm, nickname: '' }))
        return
      }

      if (!/^[a-zA-Z]{5,}$/.test(form.nickname)) {
        setError(true)
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
      const emailExists = users.find(user => user.email === form.email)

      if (emailExists) {
        setError(true)
        toast({
          title: "'email' já cadastrado!",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 1500
        })
        setForm(prevForm => ({ ...prevForm, email: '' }))
        return
      }

      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) {
        setError(true)
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
      Cookies.set('emailLabeddit', form.email, { expires: 7 })
    }

    if (form.password !== '') {
      if (!/^(?=.*[A-Za-z]{5})(?=.*\d{2}).{7,}$/.test(form.password)) {
        setError(true)
        toast({
          title:
            "'password' deve ter pelo menos 7 caracteres, incluindo pelo menos 2 números e 5 letras.",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3500
        })
        return
      }
    }

    if (form.avatar !== '') {
      if (
        !/^https?:\/\/(www\.)?[\w-]+\.[\w.-]{2,}(\/\S*)?$/.test(form.avatar)
      ) {
        setError(true)
        toast({
          title: "'avatar' deve ser um link válido.",
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 1500
        })
        setForm(prevForm => ({ ...prevForm, avatar: '' }))
        return
      }
    }
    const formData = {}
    for (const key in form) {
      if (form[key] !== '') {
        formData[key] = form[key]
      }
    }

    if (Object.keys(formData).length === 0) {
      return
    } 

    editUser(formData)                
  }

  useEffect(() => {
    findUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Flex
      minH={'100vh'}
      maxW={'100vw'}
      justifyContent='center'
      alignItems='center'
    >
     {!errorReq ? (
        !isLoading ? (
          <Flex
            direction='column'
            justifyContent='center'
            alignItems='center'
            p={8}
            h='100vh'
            w='100vw'
          >
            <Stack align={'center'} mb='2em'>
              <Heading
                justifySelf='flex-start'
                fontSize='22px'
                fontWeight='500'
                lineHeight='35px'
                fontFamily='ibm'
              >
                Editar usuário:
              </Heading>
            </Stack>

            <FormControl>
              <Flex
                direction='column'
                justifyContent='center'
                alignItems='center'
              >
                <Input
                  fontFamily='noto'
                  htmlFor='nickname'
                  placeholder={loadingFindUser? 'loading...': userNickname}
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
                  placeholder={savedEmail}
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
                    placeholder={'Nova senha'}
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
                <Input
                  mt='1em'
                  fontFamily='noto'
                  htmlFor='avatar'
                  placeholder={loadingFindUser? 'loading...': userAvatar}
                  type='text'
                  id='avatar'
                  isRequired
                  name='avatar'
                  value={form.avatar}
                  onChange={onChangeForm}
                  h='3.75em'
                  w='21em'
                />
              </Flex>
              <Flex
                direction='column'
                justifyContent='center'
                alignItems='center'
              >
                <Stack spacing={5}>
                  <AnimatedButton
                    bgGradient='linear-gradient(90deg, #FF6489, #F9B24E)'
                    color='white'
                    _hover={{
                      bgGradient: 'linear-gradient(90deg, #A8BBC6, #45525B)'
                    }}
                    mt='2.5em'
                    type='submit'
                    onClick={handleClick}
                    borderRadius='12px'
                    fontFamily='noto'
                    fontSize='18px'
                    fontWeight='700'
                    lineHeight='25px'
                    w='15em'
                    h='3em'
                    animate={
                      error
                        ? {
                            x: [-10, 10, -10, 0],
                            transition: { duration: 0.4 }
                          }
                        : {}
                    }
                    onAnimationComplete={() => setError(false)}
                  >
                    {error ? <Icon as={WarningTwoIcon} mr='0.5em' /> : null}
                    Salvar
                  </AnimatedButton>
                </Stack>
              </Flex>
            </FormControl>
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
              Salvando!
            </Text>
            <HashLoader color='#028FCC' />
          </Flex>
        )
      ) : (
        <Flex
          minH={'100vh'}
          maxW={'100vw'}
          justifyContent='center'
          alignItems='center'
          direction='column'
          gap='2em'
        >
          <Heading
            color='red'
            fontSize='38px'
            fontWeight='800'
            lineHeight='43px'
            fontFamily='ibm'
          >
            Erro na requisição!
          </Heading>
          <Image ml='3.5em' src={errorReqImage} alt='BMO crying' />
          <Heading
            color='red'
            fontSize='30px'
            fontWeight='800'
            lineHeight='43px'
            fontFamily='ibm'
          >
            Sorry T_T{' '}
          </Heading>
          <Button
            onClick={() => {
              setErrorReq(false)
              setIsLoading(false)
              goToEditUser(navigate)
            }}
          >
            Voltar
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default UserPage
