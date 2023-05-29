import { Icon, useBreakpointValue } from '@chakra-ui/react'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa'

const ScrollIcons = setShowScrollIcons => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }

  const boxSizeArrowicon = useBreakpointValue({ base: '7', smm: '10' })
  const boxSizeArrowOpacity = useBreakpointValue({ base: '0.4', smm: '1' })
  const boxSizeArrowColor = useBreakpointValue({
    base: '#6F6F6F',
    smm: '#E0E0E0'
  })

  return (
    <>
      <Icon
        as={FaArrowAltCircleDown}
        opacity={boxSizeArrowOpacity}
        boxSize={boxSizeArrowicon}
        position='fixed'
        zIndex={'docked'}
        bottom='5em'
        right='1em'
        color={boxSizeArrowColor}
        _hover={{
          cursor: 'pointer',
          color: '#6F6F6F'
        }}
        onClick={scrollToBottom}
      />

      <Icon
        as={FaArrowAltCircleUp}
        opacity={boxSizeArrowOpacity}
        boxSize={boxSizeArrowicon}
        position='fixed'
        zIndex={'docked'}
        top='5em'
        right='1em'
        color={boxSizeArrowColor}
        _hover={{
          cursor: 'pointer',
          color: '#6F6F6F'
        }}
        onClick={scrollToTop}
      />
    </>
  )
}

export default ScrollIcons
