import {
  Box,
  Flex,
  Icon,
  Image,
  Text,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { TbTrashX, TbTrashXFilled } from 'react-icons/tb'
import { TfiPencil } from 'react-icons/tfi'
import { useNavigate } from 'react-router-dom'
import { goToComments } from '../routes/coordinator'
import arrowUp from '../images/arrowUp.svg'
import arrowUpColorFull from '../images/arrowUpColorFull.svg'
import arrowUpColor from '../images/arrowUpColor.svg'
import arrowDown from '../images/arrowDown.svg'
import arrowDownColorFull from '../images/arrowDownColorFull.svg'
import arrowDownColor from '../images/arrowDownColor.svg'
import commentIcon from '../images/commentIcon.svg'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { baseURL } from '../constants/baseURL'
import { headers } from '../hooks/useAuthorizationHeader'
import { savedEmail } from '../constants/savedEmail'
import { GlobalContext } from '../contexts/GlobalContext'

const CardPost = ({
  post,
  isEditEnabled,
  setHoveredImagesEdit,
  setIsEditEnabled,
  setIsEdit,
  setHoveredImagesTrashIcon,
  hoveredImagesTrashIcon,
  onOpen,
  setPosts
}) => {
  const toast = useToast()
  const navigate = useNavigate()
  const {calculateDateDifference, media} = useContext(GlobalContext);

  const path = '/users'
  const pathPosts = '/posts'

  const [userId, setUserId] = useState('')
  const [users, setUsers] = useState([])

  const findUser = async () => {
    try {
      const response = await axios.get(`${baseURL}${path}`, headers)
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

  const likeOrDeslike = async (postId, bollean) => {
    const path2 = `/posts/${postId}/like`
    const body = {
      like: bollean
    }
    try {
      await axios.put(`${baseURL}${path2}`, body, headers)
      const response = await axios.get(`${baseURL}${pathPosts}`, headers)
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

  const [postsLikesDislikes, setPostsLikesDislikes] = useState([])

  const findLikeUserAndPost = (userId, postId) => {
    const postLike = postsLikesDislikes.find(
      postLD => postLD.userId === userId && postLD.postId === postId
    )
    return postLike ? postLike.like : null
  }

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
  }, [postsLikesDislikes])

  const [comments, setComments] = useState([])

  useEffect(() => {
    const getComments = async () => {
      const path2 = '/comments'
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
    getComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCommentsCountByPostId = postId => {
    const filteredComments = comments.filter(
      comment => comment.postId === postId
    )
    return filteredComments.length
  }

  const handleMouseEnterEdit = postId => {
    setHoveredImagesEdit(prevHoveredImages => [...prevHoveredImages, postId])
  }

  const handleMouseEnterTrashIcon = postId => {
    setHoveredImagesTrashIcon(prevHoveredImages => [
      ...prevHoveredImages,
      postId
    ])
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

  return (
    <Flex
      justifyContent='space-between'
      h='100%'
      w='100%'
      direction='column'
      flexDirection='column'
      alignItems='flex-start'
    >
      {post && postsLikesDislikes && (
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
              src={getAvatarByNickname(post.creator.nickname)}
              alt={post.creator.nickname}
            />

            <Text
              fontFamily='ibm'
              fontSize='12px'
              fontWeight='400'
              lineHeight='16px'
              color='#6F6F6F'
            >
              Enviado por: {post.creator.nickname}
            </Text>

            <Tooltip label={post.updatedAt} placement='top' bg='black' hasArrow>
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
                {calculateDateDifference(post.updatedAt)}{' '}
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
              {post.createdAt !== post.updatedAt ? '- editado' : null}
            </Text>
          </Flex>
          {post.creator.id === userId ? (
            <Flex
              direction='row'
              gap='0.3em'
              alignItems='center'
              justifyContent='center'
            >
              <Tooltip label='Editar' placement='top' bg='#4088CB' hasArrow>
                <Box>
                  <Icon
                    as={TfiPencil}
                    _hover={{
                      cursor: 'pointer',
                      color: '#4088CB'
                    }}
                    onClick={() => {
                      if (isEditEnabled) {
                        handleMouseEnterEdit(post.id)
                        setIsEditEnabled(false)
                        setIsEdit(true)
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
                isDisabled={!hoveredImagesTrashIcon.includes(post.id)}
              >
                <Box>
                  <Icon
                    as={
                      hoveredImagesTrashIcon.includes(post.id)
                        ? TbTrashXFilled
                        : TbTrashX
                    }
                    w={4}
                    h={4}
                    onClick={() => {
                      handleMouseEnterTrashIcon(post.id)
                      onOpen()
                    }}
                    _hover={
                      post.creator.id === userId
                        ? {
                            cursor: 'pointer',
                            color: 'red'
                          }
                        : null
                    }
                  />{' '}
                </Box>
              </Tooltip>
            </Flex>
          ) : null}
        </Flex>
      )}

      <Text fontFamily='ibm' fontSize='18px' fontWeight='400' lineHeight='23px'>
        {post.content}
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
          <Tooltip label={post.likes} placement='top-start' bg='#FE7E02'>
            <Image
              src={
                hoveredImagesArrowUp.includes(post.id)
                  ? arrowUpColor
                  : findLikeUserAndPost(userId, post.id) === 1
                  ? arrowUpColorFull
                  : arrowUp
              }
              boxSize={5}
              onMouseEnter={() =>
                post.creator.id !== userId && handleMouseEnterArrowUp(post.id)
              }
              onMouseLeave={() =>
                post.creator.id !== userId && handleMouseLeaveArrowUp(post.id)
              }
              onClick={() =>
                post.creator.id !== userId && likeOrDeslike(post.id, true)
              }
              _hover={
                post.creator.id !== userId
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
            {media(post.likes, post.dislikes)}
          </Text>
          <Tooltip label={post.dislikes} placement='top-end' bg='#4088CB'>
            <Image
              src={
                hoveredImagesArrowDown.includes(post.id)
                  ? arrowDownColor
                  : findLikeUserAndPost(userId, post.id) === 0
                  ? arrowDownColorFull
                  : arrowDown
              }
              boxSize={5}
              onMouseEnter={() =>
                post.creator.id !== userId && handleMouseEnterArrowDown(post.id)
              }
              onMouseLeave={() =>
                post.creator.id !== userId && handleMouseLeaveArrowDown(post.id)
              }
              onClick={() =>
                post.creator.id !== userId && likeOrDeslike(post.id, false)
              }
              _hover={
                post.creator.id !== userId
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
          _hover={{
            border: '1px solid #A8BBC6',
            cursor: 'pointer'
          }}
          onClick={() => {
            goToComments(navigate, post.id)
          }}
        >
          <Image src={commentIcon} />
          <Text
            fontFamily='ibm'
            fontSize='9.56098px'
            fontWeight='400'
            lineHeight='12px'
            color='#6F6F6F'
          >
            {getCommentsCountByPostId(post.id)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CardPost
