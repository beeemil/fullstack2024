import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
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

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm