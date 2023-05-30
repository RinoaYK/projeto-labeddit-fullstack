import Router from './routes/Router'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './styles/theme'
import GlobalProvider from './contexts/GlobalContext'


export default function App () {
  return (
    <ChakraProvider resetCSS={true} theme={theme}>      
      <GlobalProvider>
      <Router />
      </GlobalProvider>      
    </ChakraProvider>
  )
}
