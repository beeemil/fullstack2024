import { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'

const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log('error:', error)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('book-app-user-token', token)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    console.log('event',event)
    login({ variables: { username, password } })
    props.setPage("books")
  }
  if (!props.show) {
    return null
  }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
          <div>
            Username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login