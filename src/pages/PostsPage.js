import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { goToEditUser, goToPosts } from '../routes/coordinator'
import useProtectPage from '../hooks/useProtectPage'
import { useForm } from '../hooks/useForm'
import {
  Flex,
  Heading,
  Text,
  Image,
  Button,
  useDisclosure,
  FormControl,
  Textarea,
  Divider,
  useToast,
  Select,
  Tooltip,
} from '@chakra-ui/react'
import { HashLoader } from 'react-spinners'
import { baseURL } from '../constants/baseURL.js'
import useRequestPosts from '../hooks/useRequestPosts'
import AlertDeletePost from '../components/AlertDeletePost'
import errorReqImage from '../images/errorReq.gif'
import ScrollIcons from '../components/ScrollIcons'
import CardPost from '../components/CardPost'
import {
  headers,
  useAuthorizationHeader
} from '../hooks/useAuthorizationHeader'
import { savedEmail } from '../constants/savedEmail'
import { GlobalContext } from '../contexts/GlobalContext'
import useDelete from '../hooks/useDelete'

function PostsPage () {
  useAuthorizationHeader()
  const toast = useToast()
  const path = '/posts'
  const navigate = useNavigate()
  const { media, showScrollIcons } = useContext(GlobalContext)

  useProtectPage()

  const [userAvatar, setUserAvatar] = useState('')
  const [userId, setUserId] = useState('')
  const [userNickname, setUserNickname] = useState(null)
  const pathUser = '/users'

  // requisições

  const findUser = async () => {
    try {
      const response = await axios.get(`${baseURL}${pathUser}`, headers)
      const filteredData = response.data.filter(obj => obj.email === savedEmail)

      if (filteredData[0]) {
        setUserNickname(filteredData[0].nickname)
        setUserAvatar(filteredData[0].avatar)
        setUserId(filteredData[0].id)
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

  const [posts, setPosts] = useState([])

  const getPosts = async () => {
    try {
      const response = await axios.get(`${baseURL}${path}`, headers)
      setPosts(response.data)
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
    getPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts])

  const { form, onChangeForm, resetForm, setForm } = useForm({
    content: ''
  })
  const { postPostsComments, error, isLoading, setError, setIsLoading } =
    useRequestPosts(path, form)

  const handleClick = event => {
    event.preventDefault()

    if (form.content === '') {
      toast({
        title: 'Escreva alguma coisa =P',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3000
      })
      return
    }
    if (form.content !== '') {
      const postExists = posts.find(
        post => post.content === form.content && post.creator.id === userId
      )
      if (postExists) {
        toast({
          title: 'Você já criou um post com esse conteúdo!',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3000
        })
        setForm(prevForm => ({ ...prevForm, content: '' }))
        return
      }
    }

    postPostsComments()
    resetForm()
  }

  const { deletePostComment } = useDelete()

  const [hoveredImagesTrashIcon, setHoveredImagesTrashIcon] = useState([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const handleDeletePost = () => {
    if (hoveredImagesTrashIcon[0]) {
      deletePostComment(path, hoveredImagesTrashIcon[0])
    }
    setHoveredImagesTrashIcon([])
    onClose()
  }

  const [isEdit, setIsEdit] = useState(false)

  const [formEdit, setFormEdit] = useState({
    content: ''
  })

  const onChangeFormEdit = e => {
    const { name, value } = e.target
    setFormEdit({ ...formEdit, [name]: value })
  }

  const editPost = async postId => {
    try {
      await axios.put(`${baseURL}${path}/${postId}`, formEdit, headers)
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

  const [hoveredImagesEdit, setHoveredImagesEdit] = useState([])
  const handleEdit = postId => {
    if (formEdit.content !== '') {
      editPost(postId)
      setIsEdit(false)
      setFormEdit({
        content: ''
      })
    } else {
      setIsEdit(false)
    }
    setHoveredImagesEdit(prevHoveredImages =>
      prevHoveredImages.filter(id => id !== postId)
    )
    setIsEditEnabled(true)
    getPosts()
  }

  const editarButton = () => {
    if (formEdit.content === '') {
      return 'Fechar'
    } else {
      return 'Editar'
    }
    
  }

  const [isEditEnabled, setIsEditEnabled] = useState(true)

  const [order, setOrder] = useState('populares')

  return (
    <Flex
      minH={'100vh'}
      maxW={'100vw'}
      justifyContent='center'
      alignItems='center'
    >
      <Tooltip
        label='Editar usuário'
        placement='right'
        bg='#FF7264'
        ml='0.2em'
        hasArrow
      >
        <Flex
          position='absolute'
          top='0.5em'
          left='1em'
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

      {showScrollIcons && <ScrollIcons />}

      {!error ? (
        !isLoading ? (
          <Flex
            justifyContent='center'
            alignItems='center'
            pl='1em'
            pr='1em'
            mb='2em'
          >
            <AlertDeletePost
              isOpen={isOpen}
              onClose={onClose}
              cancelRef={cancelRef}
              idToDelete={hoveredImagesTrashIcon[0]}
              setHoveredImagesTrashIcon={setHoveredImagesTrashIcon}
              handleDeletePost={handleDeletePost}
            />
            <Flex
              justifyContent='center'
              alignItems='center'
              direction='column'
            >
              <FormControl>
                <Flex
                  justifyContent='center'
                  alignItems='center'
                  direction='column'
                >
                  <Textarea
                    id='content'
                    name={'content'}
                    isRequired
                    placeholder='Escreva seu post...'
                    resize='none'
                    w='22.75em'
                    h='8.1875em'
                    mt='5em'
                    borderRadius='12px'
                    bg='#EDEDED'
                    _placeholder={{
                      fontFamily: 'ibm',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '23px'
                    }}
                    value={form.content}
                    onChange={onChangeForm}
                    maxLength={110}
                  />
                  <Button
                    bgGradient='linear-gradient(90deg, #FF6489, #F9B24E)'
                    color={'white'}
                    _hover={{
                      bgGradient: 'linear-gradient(90deg, #A8BBC6, #45525B)'
                    }}
                    mt='0.6em'
                    type='submit'
                    onClick={handleClick}
                    borderRadius='12px'
                    fontFamily='noto'
                    fontSize='18px'
                    fontWeight='700'
                    lineHeight='25px'
                    w='20em'
                    h='47px'
                  >
                    Postar
                  </Button>
                </Flex>
              </FormControl>
              <Divider
                w='22.6875em'
                h='1px'
                bgGradient='linear-gradient(90deg, #FF7264, #F9B24E)'
                my='2'
                mt='2em'
                mb='1em'
              />

              <Flex
                w='22.6875em'
                justifyContent='flex-end'
                alignItems='center'
                mb='0.5em'
              >
                <Select
                  value={order}
                  onChange={e => setOrder(e.target.value)}
                  w='8em'
                >
                  <option value='populares'>Populares</option>
                  <option value='recente'>Recente</option>
                </Select>
              </Flex>

              {posts
                .sort((a, b) => {
                  if (order === 'populares') {
                    return (
                      media(b.likes, b.dislikes) - media(a.likes, a.dislikes)
                    )
                  } else if (order === 'recente') {
                    return new Date(b.updatedAt) - new Date(a.updatedAt)
                  }
                  return 0
                })
                .map(post => (
                  <Flex
                    alignItems='flex-start'
                    padding='9px 10px'
                    direction='column'
                    justifyContent='space-between'
                    width='22.75em'
                    height='10.4375em'
                    bg='#FBFBFB'
                    border='1px solid #E0E0E0'
                    borderRadius='12px'
                    key={post.id}
                    mb='1em'
                  >
                    {isEdit ? (
                      <>
                        {hoveredImagesEdit.includes(post.id) &&
                        post.creator.id === userId ? (
                          <Flex postion='relative'>
                            <FormControl>
                              <Button
                                onClick={() => {
                                  handleEdit(post.id)
                                }}
                                position='absolute'
                                zIndex='docked'
                                bottom='0.5em'
                                right='1em'
                                type='submit'
                                bgGradient='linear-gradient(90deg, #FF6489, #F9B24E)'
                                color={'white'}
                                _hover={{
                                  bgGradient:
                                    'linear-gradient(90deg, #A8BBC6, #45525B)'
                                }}
                                fontFamily='noto'
                                fontSize='14px'
                                fontWeight='400'
                                h='2em'
                                w='4.5em'
                              >
                                {editarButton()}
                              </Button>

                              <Textarea
                                id='content'
                                name={'content'}
                                isRequired
                                placeholder={post.content}
                                resize='none'
                                width='22.75em'
                                height='10.5em'
                                mt='-0.63em'
                                ml='-0.6em'
                                borderRadius='12px'
                                bg='#EDEDED'
                                _placeholder={{
                                  fontFamily: 'ibm',
                                  fontWeight: 400,
                                  fontSize: '18px',
                                  lineHeight: '23px'
                                }}
                                value={formEdit.content}
                                onChange={onChangeFormEdit}
                                maxLength={110}
                              />
                            </FormControl>
                          </Flex>
                        ) : (
                          <CardPost
                            post={post}
                            isEditEnabled={isEditEnabled}
                            setHoveredImagesEdit={setHoveredImagesEdit}
                            setIsEditEnabled={setIsEditEnabled}
                            setIsEdit={setIsEdit}
                            setHoveredImagesTrashIcon={
                              setHoveredImagesTrashIcon
                            }
                            hoveredImagesTrashIcon={hoveredImagesTrashIcon}
                            onOpen={onOpen}
                            setPosts={setPosts}
                          />
                        )}
                      </>
                    ) : (
                      <CardPost
                        post={post}
                        isEditEnabled={isEditEnabled}
                        setHoveredImagesEdit={setHoveredImagesEdit}
                        setIsEditEnabled={setIsEditEnabled}
                        setIsEdit={setIsEdit}
                        setHoveredImagesTrashIcon={setHoveredImagesTrashIcon}
                        hoveredImagesTrashIcon={hoveredImagesTrashIcon}
                        onOpen={onOpen}
                        setPosts={setPosts}
                      />
                    )}
                  </Flex>
                ))}
            </Flex>
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
              Postando!
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
              setError(false)
              setIsLoading(false)
              goToPosts(navigate)
            }}
          >
            Voltar
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default PostsPage
