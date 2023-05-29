import { useParams, useNavigate } from 'react-router-dom'
import useProtectPage from '../hooks/useProtectPage'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseURL } from '../constants/baseURL'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  Heading,
  Icon,
  Image,
  Select,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import arrowUp from '../images/arrowUp.svg'
import arrowUpColorFull from '../images/arrowUpColorFull.svg'
import arrowUpColor from '../images/arrowUpColor.svg'
import arrowDown from '../images/arrowDown.svg'
import arrowDownColorFull from '../images/arrowDownColorFull.svg'
import arrowDownColor from '../images/arrowDownColor.svg'
import commentIcon from '../images/commentIcon.svg'
import useRequestPosts from '../hooks/useRequestPosts'
import { useForm } from '../hooks/useForm'
import { HashLoader } from 'react-spinners'
import { TbTrashX, TbTrashXFilled } from 'react-icons/tb'
import { TfiPencil } from 'react-icons/tfi'
import { goToLogin, goToPosts } from '../routes/coordinator'
import AlertDeletePost from '../components/AlertDeletePost'
import errorReqImage from '../images/errorReq.gif'
import ScrollIcons from '../components/ScrollIcons'
import CardComment from '../components/CardComment'
import Cookies from 'js-cookie'
import logoM from '../../src/images/Logo_menor.svg'
import buttonX from '../../src/images/buttonX.svg'
import buttonXblue from '../../src/images/buttonXblue.svg'

function CommentsPage () {
  const toast = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = {
    headers: {
      Authorization: token
    }
  }
  useProtectPage()
  const pathPost = '/posts'

  const [posts, setPosts] = useState([])

  const pathUsers = '/users'
  const savedEmail = Cookies.get('emailUserLabeddit')

  const [userId, setUserId] = useState('')
  const [users, setUsers] = useState([])

  const findUser = async () => {
    try {
      const response = await axios.get(`${baseURL}${pathUsers}`, headers)
      const filteredData = response.data.filter(obj => obj.email === savedEmail)
      setUsers(response.data)
      if (filteredData[0]) {
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

  const getAvatarByNickname = nickname => {
    const filteredObj = users.find(obj => obj.nickname === nickname)
    if (filteredObj) {
      return filteredObj.avatar
    }
    return null
  }

  const getPosts = async () => {
    try {
      const response = await axios.get(`${baseURL}${pathPost}`, headers)
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

  const postId = posts.find(post => post.id === id)

  const [comments, setComments] = useState([])

  const getComments = async () => {
    const path2 = `/comments/post/${id}`
    try {
      const response = await axios.get(`${baseURL}${path2}`, headers)
      setComments(response.data)
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
    getComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments])

  const likeOrDeslike = async (path, id, bollean) => {
    const path2 = `/${path}/${id}/like`
    const body = {
      like: bollean
    }
    try {
      await axios.put(`${baseURL}${path2}`, body, headers)
      getPosts()
      getComments()
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

  const [hoveredImagesArrowUp, setHoveredImagesArrowUp] = useState([])

  const handleMouseEnterArrowUp = postId => {
    setHoveredImagesArrowUp(prevHoveredImages => [...prevHoveredImages, postId])
  }

  const handleMouseLeaveArrowUp = postId => {
    setHoveredImagesArrowUp(prevHoveredImages =>
      prevHoveredImages.filter(id => id !== postId)
    )
  }

  const [hoveredImagesArrowDown, setHoveredImagesArrowDown] = useState([])

  const handleMouseEnterArrowDown = postId => {
    setHoveredImagesArrowDown(prevHoveredImages => [
      ...prevHoveredImages,
      postId
    ])
  }

  const handleMouseLeaveArrowDown = postId => {
    setHoveredImagesArrowDown(prevHoveredImages =>
      prevHoveredImages.filter(id => id !== postId)
    )
  }

  const media = (nPositivo, nNegativo) => {
    return parseInt(nPositivo) - parseInt(nNegativo)
  }

  const { form, onChangeForm, resetForm, setForm } = useForm({
    content: ''
  })
  const path = `/comments/${id}`
  const pathComment = '/comments'
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
      const commentExists = comments.find(
        comment =>
          comment.content === form.content && comment.creator.id === userId
      )
      if (commentExists) {
        toast({
          title: 'Você já criou um comment com esse conteúdo!',
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

  const [hoveredImagesTrashIcon, setHoveredImagesTrashIcon] = useState([])

  const handleMouseEnterTrashIcon = postId => {
    setHoveredImagesTrashIcon(prevHoveredImages => [
      ...prevHoveredImages,
      postId
    ])
  }

  const handleMouseLeaveTrashIcon = postId => {
    setHoveredImagesTrashIcon(prevHoveredImages =>
      prevHoveredImages.filter(id => id !== postId)
    )
  }

  const deletePost = async (path, idToDelete) => {
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

  const handleDeletePost = idToDelete => {
    deletePost(pathPost, idToDelete)
    goToPosts(navigate)
  }

  const cancelRefPost = React.useRef()
  const [isEditEnabled, setIsEditEnabled] = useState(true)
  const {
    isOpen: isOpenPost,
    onOpen: onOpenPost,
    onClose: onClosePost
  } = useDisclosure()

  const [isEditPost, setIsEditPost] = useState(false)
  const [isEditComment, setIsEditComment] = useState(false)

  const [formEditPost, setFormEditPost] = useState({
    content: ''
  })
  const [formEditComment, setFormEditComment] = useState({
    content: ''
  })

  const onChangeFormEditPost = e => {
    const { name, value } = e.target
    setFormEditPost({ ...formEditPost, [name]: value })
  }

  const onChangeFormEditComment = e => {
    const { name, value } = e.target
    setFormEditComment({ ...formEditComment, [name]: value })
  }

  const editPost = async postId => {
    try {
      await axios.put(`${baseURL}${pathPost}/${postId}`, formEditPost, headers)
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

  const editComment = async postId => {
    try {
      await axios.put(
        `${baseURL}${pathComment}/${postId}`,
        formEditComment,
        headers
      )
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

  const handleEditPost = postId => {
    if (formEditPost.content !== '') {
      editPost(postId)
      setIsEditPost(false)
      setFormEditPost({
        content: ''
      })
    } else {
      setIsEditPost(false)
    }
  }

  const editarButtonPost = () => {
    if (formEditPost.content === '') {
      return 'Fechar'
    } else {
      return 'Editar'
    }
  }

  const [isEditEnabledComment, setIsEditEnabledComment] = useState(true)

  const handleEditComment = commentId => {
    if (formEditComment.content !== '') {
      editComment(commentId)
      setIsEditComment(false)
      setFormEditComment({
        content: ''
      })
    } else {
      setIsEditComment(false)
    }
    setIsEditEnabledComment(true)
  }

  const editarButtonComment = () => {
    if (formEditComment.content === '') {
      return 'Fechar'
    } else {
      return 'Editar'
    }
  }

  const [editId, setEditId] = useState('')

  const [showScrollIcons, setShowScrollIcons] = useState(false)

  useEffect(() => {
    function handleScroll () {
      const scrollThreshold = 0
      const scrollY = window.scrollY || window.pageYOffset
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      setShowScrollIcons(
        scrollY > scrollThreshold && scrollY < documentHeight - windowHeight
      )
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const calculateDateDifference = creationDate => {
    const currentDate = new Date()
    const parsedCreationDate = new Date(creationDate)

    const timeDifference = currentDate.getTime() - parsedCreationDate.getTime()

    const yearsDifference = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24 * 365)
    )
    if (yearsDifference > 0) {
      return yearsDifference + (yearsDifference === 1 ? ' ano' : ' anos')
    }

    const monthsDifference = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24 * 30)
    )
    if (monthsDifference > 0) {
      return monthsDifference + (monthsDifference === 1 ? ' mês' : ' meses')
    }

    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    if (daysDifference > 0) {
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)) % 24
      if (hoursDifference > 0) {
        return (
          daysDifference +
          (daysDifference === 1 ? ' dia' : ' dias') +
          ` e ${hoursDifference} horas`
        )
      } else {
        return daysDifference + (daysDifference === 1 ? ' dia' : ' dias')
      }
    }

    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60))
    if (hoursDifference > 0) {
      return hoursDifference + (hoursDifference === 1 ? ' hora' : ' horas')
    }

    const minutesDifference = Math.floor(timeDifference / (1000 * 60))
    if (minutesDifference > 0) {
      return (
        minutesDifference + (minutesDifference === 1 ? ' minuto' : ' minutos')
      )
    }
    return 'Menos de um minuto'
  }

  const findLikeUserAndPost = (userId, postId) => {
    const postLike = postsLikesDislikes.find(
      postLD => postLD.userId === userId && postLD.postId === postId
    )
    return postLike ? postLike.like : null
  }

  const [postsLikesDislikes, setPostsLikesDislikes] = useState([])

  useEffect(() => {
    const getPostsLikesDislikes = async () => {
      const path2 = '/posts/likes/post'
      try {
        const response = await axios.get(`${baseURL}${path2}`, headers)
        setPostsLikesDislikes(response.data)
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
    getPostsLikesDislikes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findLikeUserAndPost])

  const [order, setOrder] = useState('populares')

  const logout = () => {
    localStorage.removeItem('token')
    Cookies.remove('emailUserLabeddit')
    goToLogin(navigate)
  }

  const [isHoveredDeleteIcon, setIsHoveredDeleteIcon] = useState(false)

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

        <Image src={logoM} gridColumn='2' justifySelf='center' ml={'3em'} />
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
      </Grid>

      {showScrollIcons && <ScrollIcons />}

      {!error ? (
        !isLoading ? (
          <Flex
            justifyContent='center'
            alignItems='center'
            pl='1em'
            pr='1em'
            pb='2em'
            direction='column'
            minH='100vh'
          >
            {postId && !isEditPost ? (
              <Flex
                mt='5em'
                alignItems='flex-start'
                padding='9px 10px'
                direction='column'
                justifyContent='space-between'
                width='22.75em'
                height='10.4375em'
                bg='#FBFBFB'
                border='1px solid #E0E0E0'
                borderRadius='12px'
                mb='1em'
              >
                <Flex justifyContent='space-between' w='100%'>
                  <Flex
                    direction='row'
                    gap='0.5em'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <Image
                      boxSize='25px'
                      borderRadius='50%'
                      bg='#EDEDED'
                      src={getAvatarByNickname(postId.creator.nickname)}
                      alt={postId.creator.nickname}
                    />
                    <Text
                      fontFamily='ibm'
                      fontSize='12px'
                      fontWeight='400'
                      lineHeight='16px'
                      color='#6F6F6F'
                    >
                      Enviado por: {postId.creator.nickname}
                    </Text>

                    <Tooltip
                      label={postId.updatedAt}
                      placement='top'
                      bg='black'
                      hasArrow
                    >
                      <Text
                        fontFamily='ibm'
                        fontSize='10px'
                        fontWeight='400'
                        lineHeight='16px'
                        color='#6F6F6F'
                        _hover={{
                          cursor: 'pointer'
                        }}
                      >
                        {' '}
                        {calculateDateDifference(postId.updatedAt)}{' '}
                      </Text>
                    </Tooltip>
                    <Text
                      fontFamily='ibm'
                      fontSize='8px'
                      fontWeight='400'
                      lineHeight='16px'
                      color='#4088CB'
                      ml='-1em'
                    >
                      {postId.createdAt !== postId.updatedAt
                        ? '- editado'
                        : null}
                    </Text>
                  </Flex>
                  {postId.creator.id === userId ? (
                    <Flex
                      direction='row'
                      gap='0.3em'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Tooltip
                        label='Editar'
                        placement='top'
                        bg='#4088CB'
                        hasArrow
                      >
                        <Box>
                          <Icon
                            as={TfiPencil}
                            _hover={
                              postId.creator.id === userId
                                ? {
                                    cursor: 'pointer',
                                    color: '#4088CB'
                                  }
                                : null
                            }
                            onClick={() => {
                              if (isEditEnabled) {
                                setIsEditPost(true)
                              }
                            }}
                          />
                        </Box>
                      </Tooltip>
                      <Tooltip
                        label='Excluir!'
                        placement='top'
                        bg='red'
                        hasArrow
                      >
                        <Box>
                          <Icon
                            as={
                              hoveredImagesTrashIcon.includes(postId.id)
                                ? TbTrashXFilled
                                : TbTrashX
                            }
                            w={4}
                            h={4}
                            onMouseEnter={() =>
                              postId.creator.id === userId &&
                              handleMouseEnterTrashIcon(postId.id)
                            }
                            onMouseLeave={() =>
                              postId.creator.id === userId &&
                              handleMouseLeaveTrashIcon(postId.id)
                            }
                            onClick={() => {
                              postId.creator.id === userId && onOpenPost()
                            }}
                            _hover={
                              postId.creator.id === userId && isEditEnabled
                                ? {
                                    cursor: 'pointer',
                                    color: 'red'
                                  }
                                : null
                            }
                          />{' '}
                          <AlertDeletePost
                            isOpen={isOpenPost}
                            onClose={onClosePost}
                            cancelRef={cancelRefPost}
                            idToDelete={postId.id}
                            setHoveredImagesTrashIcon={
                              setHoveredImagesTrashIcon
                            }
                            handleDeletePost={handleDeletePost}
                          />
                        </Box>
                      </Tooltip>
                    </Flex>
                  ) : null}
                </Flex>
                <Text
                  fontFamily='ibm'
                  fontSize='18px'
                  fontWeight='400'
                  lineHeight='23px'
                >
                  {postId.content}
                </Text>
                <Flex gap='1em'>
                  <Flex
                    flexDirection='row'
                    justifyContent='space-between'
                    alignItems='center'
                    padding='4.66667px'
                    gap='15.92px'
                    h='28px'
                    border='0.796748px solid #ECECEC'
                    borderRadius='28px'
                  >
                    {/*  */}
                    <Tooltip
                      label={postId.likes}
                      placement='top-start'
                      bg='#FE7E02'
                    >
                      <Image
                        src={
                          hoveredImagesArrowUp.includes(postId.id)
                            ? arrowUpColor
                            : findLikeUserAndPost(userId, postId.id) === 1
                            ? arrowUpColorFull
                            : arrowUp
                        }
                        boxSize={5}
                        onMouseEnter={() =>
                          postId.creator.id !== userId &&
                          handleMouseEnterArrowUp(postId.id)
                        }
                        onMouseLeave={() =>
                          postId.creator.id !== userId &&
                          handleMouseLeaveArrowUp(postId.id)
                        }
                        onClick={() =>
                          postId.creator.id !== userId &&
                          likeOrDeslike('posts', postId.id, true)
                        }
                        _hover={
                          postId.creator.id !== userId
                            ? {
                                cursor: 'pointer'
                              }
                            : null
                        }
                      />
                    </Tooltip>
                    <Text
                      fontFamily='ibm'
                      fontSize='9.56098px'
                      fontWeight='700'
                      lineHeight='12px'
                      color='#6F6F6F'
                    >
                      {media(postId.likes, postId.dislikes)}
                    </Text>
                    <Tooltip
                      label={postId.dislikes}
                      placement='top-end'
                      bg='#45525B'
                    >
                      <Image
                        src={
                          hoveredImagesArrowDown.includes(postId.id)
                            ? arrowDownColor
                            : findLikeUserAndPost(userId, postId.id) === 0
                            ? arrowDownColorFull
                            : arrowDown
                        }
                        boxSize={5}
                        onMouseEnter={() =>
                          postId.creator.id !== userId &&
                          handleMouseEnterArrowDown(postId.id)
                        }
                        onMouseLeave={() =>
                          postId.creator.id !== userId &&
                          handleMouseLeaveArrowDown(postId.id)
                        }
                        onClick={() =>
                          postId.creator.id !== userId &&
                          likeOrDeslike('posts', postId.id, false)
                        }
                        _hover={
                          postId.creator.id !== userId
                            ? {
                                cursor: 'pointer'
                              }
                            : null
                        }
                      />
                    </Tooltip>
                  </Flex>

                  <Flex
                    justifyContent='center'
                    flexDirection='row'
                    alignItems='center'
                    padding='8px'
                    gap='8px'
                    w='65.33px'
                    h='28px'
                    border='0.796748px solid #ECECEC'
                    borderRadius='28px'
                  >
                    <Image src={commentIcon} />
                    <Text
                      fontFamily='ibm'
                      fontSize='9.56098px'
                      fontWeight='400'
                      lineHeight='12px'
                      color='#6F6F6F'
                    >
                      {comments.length}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              postId && (
                <Flex postion='relative'>
                  <FormControl>
                    <Button
                      onClick={() => {
                        handleEditPost(postId.id)
                      }}
                      position='absolute'
                      zIndex='docked'
                      bottom='2em'
                      right='1em'
                      type='submit'
                      bgGradient='linear-gradient(90deg, #FF6489, #F9B24E)'
                      color={'white'}
                      _hover={{
                        bgGradient: 'linear-gradient(90deg, #A8BBC6, #45525B)'
                      }}
                      fontFamily='noto'
                      fontSize='14px'
                      fontWeight='400'
                      h='2em'
                      w='4.5em'
                    >
                      {editarButtonPost()}
                    </Button>

                    <Textarea
                      id='content'
                      name={'content'}
                      isRequired
                      placeholder={postId.content}
                      resize='none'
                      width='22.75em'
                      height='10.4375em'
                      mt='5em'
                      mb='1em'
                      borderRadius='12px'
                      bg='#EDEDED'
                      _placeholder={{
                        fontFamily: 'ibm',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '23px'
                      }}
                      value={formEditPost.content}
                      onChange={onChangeFormEditPost}
                      maxLength={110}
                    />
                  </FormControl>
                </Flex>
              )
            )}

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
                  placeholder='Adicionar comentário'
                  resize='none'
                  w='22.75em'
                  h='8.1875em'
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
                  mt='0.5em'
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
                  Responder
                </Button>
              </Flex>
            </FormControl>
            <Divider
              w='22.6875em'
              h='1px'
              bgGradient='linear-gradient(90deg, #FF7264, #F9B24E)'
              my='2'
              mt='1em'
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

            {comments
              .sort((a, b) => {
                if (order === 'populares') {
                  return media(b.likes, b.dislikes) - media(a.likes, a.dislikes)
                } else if (order === 'recente') {
                  return new Date(b.updatedAt) - new Date(a.updatedAt)
                }
                return 0
              })
              .map(comment =>
                !isEditComment && editId !== comment.id ? (
                  <CardComment
                    comment={comment}
                    calculateDateDifference={calculateDateDifference}
                    setIsEditEnabledComment={setIsEditEnabledComment}
                    isEditEnabledComment={isEditEnabledComment}
                    setIsEditComment={setIsEditComment}
                    setEditId={setEditId}
                    isEditEnabled={isEditEnabled}
                    hoveredImagesTrashIcon={hoveredImagesTrashIcon}
                    handleMouseEnterTrashIcon={handleMouseEnterTrashIcon}
                    handleMouseLeaveTrashIcon={handleMouseLeaveTrashIcon}
                    setIsEditEnabled={setIsEditEnabled}
                    setHoveredImagesTrashIcon={setHoveredImagesTrashIcon}
                    hoveredImagesArrowUp={hoveredImagesArrowUp}
                    handleMouseEnterArrowUp={handleMouseEnterArrowUp}
                    handleMouseLeaveArrowUp={handleMouseLeaveArrowUp}
                    likeOrDeslike={likeOrDeslike}
                    media={media}
                    hoveredImagesArrowDown={hoveredImagesArrowDown}
                    handleMouseEnterArrowDown={handleMouseEnterArrowDown}
                    handleMouseLeaveArrowDown={handleMouseLeaveArrowDown}
                    deletePost={deletePost}
                  />
                ) : editId === comment.id ? (
                  <Flex
                    postion='relative'
                    padding='9px 10px'
                    gap='18px'
                    direction='column'
                    justifyContent='space-between'
                    width='22.75em'
                    height='10.4375em'
                    bg='#FBFBFB'
                    border='1px solid #E0E0E0'
                    borderRadius='12px'
                    mb='1em'
                  >
                    <FormControl>
                      <Button
                        onClick={() => {
                          handleEditComment(comment.id)
                          setEditId('')
                        }}
                        position='absolute'
                        zIndex='docked'
                        bottom='3em'
                        right='0em'
                        type='submit'
                        bgGradient='linear-gradient(90deg, #FF6489, #F9B24E)'
                        color={'white'}
                        _hover={{
                          bgGradient: 'linear-gradient(90deg, #A8BBC6, #45525B)'
                        }}
                        fontFamily='noto'
                        fontSize='14px'
                        fontWeight='400'
                        h='2em'
                        w='4.5em'
                      >
                        {editarButtonComment()}
                      </Button>

                      <Textarea
                        id='content'
                        name={'content'}
                        isRequired
                        placeholder={comment.content}
                        resize='none'
                        width='22.75em'
                        height='10.4375em'
                        mt='-0.55em'
                        ml='-0.6em'
                        mb='2em'
                        borderRadius='12px'
                        bg='#EDEDED'
                        _placeholder={{
                          fontFamily: 'ibm',
                          fontWeight: 400,
                          fontSize: '18px',
                          lineHeight: '23px'
                        }}
                        value={formEditComment.content}
                        onChange={onChangeFormEditComment}
                        maxLength={110}
                      />
                    </FormControl>
                  </Flex>
                ) : (
                  <CardComment
                    comment={comment}
                    calculateDateDifference={calculateDateDifference}
                    setIsEditEnabledComment={setIsEditEnabledComment}
                    isEditEnabledComment={isEditEnabledComment}
                    setIsEditComment={setIsEditComment}
                    setEditId={setEditId}
                    isEditEnabled={isEditEnabled}
                    hoveredImagesTrashIcon={hoveredImagesTrashIcon}
                    handleMouseEnterTrashIcon={handleMouseEnterTrashIcon}
                    handleMouseLeaveTrashIcon={handleMouseLeaveTrashIcon}
                    setIsEditEnabled={setIsEditEnabled}
                    setHoveredImagesTrashIcon={setHoveredImagesTrashIcon}
                    hoveredImagesArrowUp={hoveredImagesArrowUp}
                    handleMouseEnterArrowUp={handleMouseEnterArrowUp}
                    handleMouseLeaveArrowUp={handleMouseLeaveArrowUp}
                    likeOrDeslike={likeOrDeslike}
                    media={media}
                    hoveredImagesArrowDown={hoveredImagesArrowDown}
                    handleMouseEnterArrowDown={handleMouseEnterArrowDown}
                    handleMouseLeaveArrowDown={handleMouseLeaveArrowDown}
                    deletePost={deletePost}
                  />
                )
              )}
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

export default CommentsPage
