import {
  Box,
  Flex,
  Icon,
  Image,
  Text,
  Tooltip,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { TbTrashX, TbTrashXFilled } from 'react-icons/tb'
import { TfiPencil } from 'react-icons/tfi'
import AlertDeleteComment from './AlertDeleteComment'
import { useContext, useEffect, useState } from 'react'
import React from 'react'
import arrowUp from '../images/arrowUp.svg'
import arrowUpColorFull from '../images/arrowUpColorFull.svg'
import arrowUpColor from '../images/arrowUpColor.svg'
import arrowDown from '../images/arrowDown.svg'
import arrowDownColorFull from '../images/arrowDownColorFull.svg'
import arrowDownColor from '../images/arrowDownColor.svg'
import axios from 'axios'
import { baseURL } from '../constants/baseURL'
import { headers, useAuthorizationHeader } from '../hooks/useAuthorizationHeader'
import { savedEmail } from '../constants/savedEmail'
import { GlobalContext } from '../contexts/GlobalContext'
import useDelete from '../hooks/useDelete'

const CardComment = ({
  comment,  
  setIsEditEnabledComment,
  isEditEnabledComment,
  setIsEditComment,
  setEditId,
  isEditEnabled,
  hoveredImagesTrashIcon,
  handleMouseEnterTrashIcon,
  handleMouseLeaveTrashIcon,
  setIsEditEnabled,
  setHoveredImagesTrashIcon,
  hoveredImagesArrowUp,
  handleMouseEnterArrowUp,
  handleMouseLeaveArrowUp,
  likeOrDeslike,  
  hoveredImagesArrowDown,
  handleMouseEnterArrowDown,
  handleMouseLeaveArrowDown,  
}) => {
  useAuthorizationHeader()
  const toast = useToast()
  const {calculateDateDifference, media} = useContext(GlobalContext);
  const pathUsers = '/users'  

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
  const {deletePostComment} =  useDelete()

  const [selectedCommentId, setSelectedCommentId] = useState(null)
  const handleDeleteComment = idToDelete => {
    setIsEditEnabled(true)
    deletePostComment('/comments', idToDelete)
  }
  const cancelRefComment = React.useRef()

  const {
    isOpen: isOpenComment,
    onOpen: onOpenComment,
    onClose: onCloseComment
  } = useDisclosure()

  const [commentsLikesDislikes, setCommentsLikesDislikes] = useState([])

  const findLikeUserAndComment = (userId, commentId) => {
    const commentLike = commentsLikesDislikes.find(
      commentLD =>
        commentLD.userId === userId && commentLD.commentId === commentId
    )
    return commentLike ? commentLike.like : null
  }

  useEffect(() => {    
    const getCommentsLikesDislikes = async () => {
      const path2 = '/comments/likes/comment'
      try {
        const response = await axios.get(`${baseURL}${path2}`, headers)
        setCommentsLikesDislikes(response.data)
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

    getCommentsLikesDislikes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsLikesDislikes])

  return (    
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
      key={comment.id}
      mb='1em'
    >
      {commentsLikesDislikes &&
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
            src={getAvatarByNickname(comment.creator.nickname)}
            alt={comment.creator.nickname}
          />

          <Text
            fontFamily='ibm'
            fontSize='12px'
            fontWeight='400'
            lineHeight='16px'
            color='#6F6F6F'
          >
            Enviado por: {comment.creator.nickname}
          </Text>

          <Tooltip
            label={comment.updatedAt}
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
              {calculateDateDifference(comment.updatedAt)}{' '}
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
            {comment.createdAt !== comment.updatedAt ? '- editado' : null}
          </Text>
        </Flex>
        {comment.creator.id === userId ? (
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
                  _hover={
                    comment.creator.id === userId
                      ? {
                          cursor: 'pointer',
                          color: '#4088CB'
                        }
                      : null
                  }
                  onClick={() => {
                    if (isEditEnabledComment) {
                      setIsEditEnabledComment(false)
                      setIsEditComment(true)
                      setEditId(comment.id)
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
              isDisabled={!isEditEnabled}
            >
              <Box>
                <Icon
                  as={
                    isEditEnabled && hoveredImagesTrashIcon.includes(comment.id)
                      ? TbTrashXFilled
                      : TbTrashX
                  }
                  w={4}
                  h={4}
                  onMouseEnter={() =>
                    comment.creator.id === userId &&
                    isEditEnabled &&
                    handleMouseEnterTrashIcon(comment.id)
                  }
                  onMouseLeave={() =>
                    comment.creator.id === userId &&
                    isEditEnabled &&
                    handleMouseLeaveTrashIcon(comment.id)
                  }
                  onClick={() => {
                    comment.creator.id === userId &&
                      isEditEnabled &&
                      setSelectedCommentId(comment.id)
                    setIsEditEnabled(false)
                    onOpenComment()
                  }}
                  _hover={
                    comment.creator.id === userId
                      ? {
                          cursor: 'pointer',
                          color: 'red'
                        }
                      : null
                  }
                />{' '}
                <AlertDeleteComment
                  isOpen={isOpenComment}
                  onClose={onCloseComment}
                  cancelRef={cancelRefComment}
                  idToDelete={selectedCommentId}
                  setHoveredImagesTrashIcon={setHoveredImagesTrashIcon}
                  handleDeleteComment={handleDeleteComment}
                />
              </Box>
            </Tooltip>
          </Flex>
        ) : null}
      </Flex>}
      <Text fontFamily='ibm' fontSize='18px' fontWeight='400' lineHeight='23px'>
        {comment.content}
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
          <Tooltip label={comment.likes} placement='top-start' bg='#FE7E02'>
            <Image
              src={
                hoveredImagesArrowUp.includes(comment.id)
                  ? arrowUpColor
                  : findLikeUserAndComment(userId, comment.id) === 1
                  ? arrowUpColorFull
                  : arrowUp
              }
              boxSize={5}
              onMouseEnter={() =>
                comment.creator.id !== userId &&
                handleMouseEnterArrowUp(comment.id)
              }
              onMouseLeave={() =>
                comment.creator.id !== userId &&
                handleMouseLeaveArrowUp(comment.id)
              }
              onClick={() =>
                comment.creator.id !== userId &&
                likeOrDeslike('comments', comment.id, true)
              }
              _hover={
                comment.creator.id !== userId
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
            {media(comment.likes, comment.dislikes)}
          </Text>
          <Tooltip label={comment.dislikes} placement='top-end' bg='#45525B'>
            <Image
              src={
                hoveredImagesArrowDown.includes(comment.id)
                  ? arrowDownColor
                  : findLikeUserAndComment(userId, comment.id) === 0
                  ? arrowDownColorFull
                  : arrowDown
              }
              boxSize={5}
              onMouseEnter={() =>
                comment.creator.id !== userId &&
                handleMouseEnterArrowDown(comment.id)
              }
              onMouseLeave={() =>
                comment.creator.id !== userId &&
                handleMouseLeaveArrowDown(comment.id)
              }
              onClick={() =>
                comment.creator.id !== userId &&
                likeOrDeslike('comments', comment.id, false)
              }
              _hover={
                comment.creator.id !== userId
                  ? {
                      cursor: 'pointer'
                    }
                  : null
              }
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CardComment
