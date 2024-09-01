import { useState, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'
import userService from '../services/users'
import NotificationContext from '../NotificationContext'
import LoginContext from '../LoginContext'
import { useParams } from 'react-router-dom'


const Blog = () => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  }

  const id = useParams().id
  const result = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogService.getById(id)
  })
  const [blogUser, setBlogUser] = useState({ username:'', name:'', blogs:[], id:'' })
  const [comment, setComment] = useState('')
  const [user, loginDispatch] = useContext(LoginContext)
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (d,v,c) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData(['blogs'], blogs.filter(b => b.id !== v.id))
    }
  })
  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (data) => {
      queryClient.setQueryData(['blogs', id],data)
    },
    onError: () => {
    }
  })
  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (data) => {
      queryClient.setQueryData(['blogs', id], data)
    }
  })
  const addComment = async (event) => {
    event.preventDefault()
    await addCommentMutation.mutateAsync({ ...blog, comments: [...blog.comments, comment], user: blogUser.id })
    setComment('')
  }
  const addLikeTo = async (blog) => {
    try {
      await updateBlogMutation.mutateAsync({ ...blog, likes: blog.likes + 1, user: blogUser.id })
      notificationDispatch({ type:'SET', payload:`You liked ${blog.title}` })
    }
    catch (error) {
      console.log('error',error)
      notificationDispatch({ type:'SET', payload:`${blog.title} was already removed from server` })
    }
  }
  const removeBlog = async (blog) => {
    try {
      await removeBlogMutation.mutateAsync({ blog, user: blogUser.id })
      notificationDispatch({ type:'SET', payload:`You removed ${blog.title}` })
    } catch {
      notificationDispatch({ type:'SET', payload:`${blog.title} was already removed from server` })
    }
  }
  if ( result.isLoading ) {
    return <div>Loading data...</div>
  }
  if ( result.isError ) {
    <div>User service not available due to problems in server</div>
  }
  const handleChange = (event) => {
    setComment(event.target.value)
  }

  const blog = result.data
  userService.getById(blog.user).then(user => {
    setBlogUser(user)
  })
  const showDelete = { display: blogUser.username === user.username ? '' : 'none' }
  return (
    <div style={blogStyle} className="blog">
      <h3>{blog.title} By {blog.author}</h3>
      <div>
        <p>{blog.url}</p>
        <p name="likes">
          likes: {blog.likes}
          <button onClick={() => addLikeTo(blog)} name="likeButton">
            like
          </button>
        </p>
        <p>Added by {blogUser.name}</p>
        <button style={showDelete} onClick={() => removeBlog(blog)}>
        Remove
        </button>
      </div>
      <h4>Comments</h4>
      <form onSubmit={addComment}>
          comment:{' '}
        <input
          value={comment}
          onChange={handleChange}
          name="comment"
          placeholder="Comment here"
        />
        {' '}
        <button type="submit" name="add">
            add
        </button>{' '}
      </form>
      {blog.comments.map((c) => (<li key = {c}> {c} </li>))}
    </div>
  )
}

export default Blog
