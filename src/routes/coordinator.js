export const goToLogin = navigate => {
  navigate('/')
}

export const goToSignUp = navigate => {
  navigate('/signup')
}

export const goToPosts = navigate => {
  navigate('/posts')
}

export const goToComments = (navigate,id) => {
  navigate(`/comments/${id}`)
}

export const goToEditUser = navigate => {
  navigate('/user')
}

export const goToError = navigate => {
  navigate('*')
}
