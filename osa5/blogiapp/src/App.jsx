import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('error')
  const blogFormRef = useRef()
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationType('notification')
      setNotificationMessage('Logged in successfully')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType('error')
      },5000)
    } catch (exception) {
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }
  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')

    setUser(null)
  }
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    returnedBlog.user = { id: returnedBlog.user, name:user.name, username:user.username }
    console.log('returnedBlgo', returnedBlog)
    setBlogs(blogs.concat(returnedBlog))
    setNotificationType('notification')
    setNotificationMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType('error')
    }, 5000)
  }
  const addLikeTo = async id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes+1, user:blog.user.id }
    console.log('changedBlog', changedBlog)
    try {
      const returnedBlog = await blogService.update(id, changedBlog)
      console.log('ReturnedBlog', returnedBlog)
      returnedBlog.user = blog.user
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (error) {
      setNotificationMessage(`${blog.title} was already removed from server`)
      setTimeout(() => {
        setNotificationMessage(null)
      },5000)
    }
  }

  const removeBlog = async blog => {
    if (window.confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}?`)){
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch(error) {
        setNotificationMessage(`${blog.title} was already removed from server`)
        setTimeout(() => {
          setNotificationMessage(null)
        },5000)
      }}
  }
  return (<div>
    <h2>blogs</h2>
    <Notification message = {notificationMessage} type = {notificationType}/>
    {!user &&
      <div>
        <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
      </div>
    }
    {user &&
      <div>

        <div><p>{user.name} logged in</p><button onClick={handleLogout}>logout</button></div>
        <Togglable buttonLabel='add new' ref={blogFormRef}>
          <BlogForm createBlog={addBlog}/>
        </Togglable>
        {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} addLike={() => addLikeTo(blog.id)} username={user.username} removeBlog={() => removeBlog(blog)}/>
        )}</div>

    }
  </div>
  )
}

export default App