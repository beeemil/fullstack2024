import { createContext, useReducer } from 'react'


export const loginReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.payload
  case 'LOGOUT':
    return null
  default:
    return state
  }
}
const LoginContext = createContext()
export const LoginContextProvider = (props) => {
  const [login, loginDispatch] = useReducer(loginReducer, JSON.parse(window.localStorage.getItem('loggedBlogAppUser')))

  return (
    <LoginContext.Provider value={[login, loginDispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContext