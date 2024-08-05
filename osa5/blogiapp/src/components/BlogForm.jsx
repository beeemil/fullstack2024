import { useState } from 'react'
import PropTypes from 'prop-types'
const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })

  }
  return (
    <div className='formDiv'>
      <form onSubmit={addBlog}>
        <div>title: <input value = {newBlog.title} onChange={handleChange} name="title" placeholder='title here'/></div>
        <div>author: <input value = {newBlog.author} onChange={handleChange} name="author" placeholder='author here'/></div>
        <div>url: <input value = {newBlog.url} onChange = {handleChange} name="url" placeholder='url here'/></div>
        <div> <button type="submit" name='add'>add</button> </div>
      </form>
    </div>
  )
}

BlogForm.PropTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm