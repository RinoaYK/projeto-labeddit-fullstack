import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'

const AlertDeleteComment = ({
  isOpen,
  onClose,
  cancelRef,
  idToDelete,
  setHoveredImagesTrashIcon,
  handleDeleteComment
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent w='20em'>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Excluir post
          </AlertDialogHeader>

          <AlertDialogBody>
            Você tem certeza que quer deletar seu post?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                setHoveredImagesTrashIcon([])
                onClose()
              }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme='red'
              onClick={() => {                
                handleDeleteComment(idToDelete)
                onClose()
              }}              
              ml={3}
            >
              Excluir!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
export default AlertDeleteComment
