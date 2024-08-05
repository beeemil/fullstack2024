import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, username, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible,setVisible] = useState(false)
  const showDelete = { display: blog.user.username === username ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const show = { display: visible ? '' : 'none' }
  return (
    <div style={blogStyle} className='blog'>
      <span className='blog-title'>{blog.title} </span>{blog.author} <button onClick={toggleVisibility} name='toggleVis'>{visible ? 'hide' : 'show'}</button>
      <div style={show}>
        <p>{blog.url}</p>
        <p name='likes'>likes: {blog.likes}<button onClick={addLike} name='likeButton'>like</button></p>
        <p>{blog.user.name}</p>
        <button style={showDelete} onClick={removeBlog} >Remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog