import PropTypes from 'prop-types'
import { useContext, useState, useEffect } from 'react'
import LoginContext from '../LoginContext'
import { useMutation } from '@tanstack/react-query'
import loginService from '../services/login'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, loginDispatch] = useContext(LoginContext)
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const newLoginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (data) => {
      loginDispatch({ type:'LOGIN', payload:data })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(data))
      blogService.setToken(data.token)
      return data
    },
    onError: (error) => {
      console.log('error')
    }
  })
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      await newLoginMutation.mutateAsync({
        username,
        password,
      })
      setUsername('')
      setPassword('')
      notificationDispatch({ type: 'SET', payload: 'logged in successfully' })
    } catch (exception) {
      notificationDispatch({ type: 'SET', payload: 'wrong username or password' })
    }
  }
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
    }
  }, [])
  return (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Log in to application</h2>
        username
        <input
          type="text"
          value={username}
          name="Username"
          data-testid="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          data-testid="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}


export default LoginForm
