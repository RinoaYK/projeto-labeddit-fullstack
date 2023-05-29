import Router from './routes/Router'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './styles/theme'

export default function App () {
  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      <Router />
    </ChakraProvider>
  )
}
