import React, { createContext, useEffect, useState } from 'react'

export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

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

const media = (nPositivo, nNegativo) => {
  return parseInt(nPositivo) - parseInt(nNegativo)
}

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

  return (
    <GlobalContext.Provider
      value={{
        calculateDateDifference,
        media,
        showScrollIcons,

      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
export default GlobalProvider
