import { useRef, useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import NotificationContext from './NotificationContext'
import LoginContext from './LoginContext'
import blogService from './services/blogs'

const App = () => {
  const padding = {
    padding: 5
  }
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [user, loginDispatch] = useContext(LoginContext)
  const blogFormRef = useRef()

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    loginDispatch({ type:'LOGOUT' })
  }
  useEffect(() => {
    const loggedBlogAppUser = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedBlogAppUser) {
      const user = JSON.parse(loggedBlogAppUser)
      blogService.setToken(user.token)
    }
  },[])

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <div className='container'>
        <h2>blogs</h2>
        <Notification/>
        {!user && (<LoginForm/>)}
        {user && (
          <div>
            <div>
              <Link style={padding} to="/">home</Link>
              <Link style={padding} to="/users">users</Link>
              {user.name} logged in
              <button onClick={handleLogout}>logout</button>
            </div>
            <br/>
            <Togglable buttonLabel="add new" ref={blogFormRef}>
              <BlogForm blogFormRef={blogFormRef} user = {user}/>
            </Togglable>
            <br/>
            <Routes>
              <Route path = "/" element = {<Blogs/>}/>
              <Route path = "/users" element = {<Users/>}/>
              <Route path = "/users/:id" element = {<User/>} />
              <Route path = "/blogs/:id" element = {<Blog/>} />
            </Routes>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  )
}

export default App
