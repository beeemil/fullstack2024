import { useState, useContext } from 'react'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import LoginContext from '../LoginContext'

const BlogForm = ({ blogFormRef }) => {
  const [user, loginDispatch] = useContext(LoginContext)
  const queryClient = useQueryClient()
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data) => {
      console.log('new',data)
      data.user = {
        ...user,
      }
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(data))
    },
    onError: (error) => {
      console.log('error')
    }
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value,
    })
  }

  const addBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    console.log('user',user)
    await newBlogMutation.mutateAsync({ ...newBlog, user: user })
    setNewBlog({ title: '', author: '', url: '' })
  }
  return (
    <div className="formDiv">
      <form onSubmit={addBlog}>
        <div>
          title:{' '}
          <input
            value={newBlog.title}
            onChange={handleChange}
            name="title"
            placeholder="title here"
          />
        </div>
        <div>
          author:{' '}
          <input
            value={newBlog.author}
            onChange={handleChange}
            name="author"
            placeholder="author here"
          />
        </div>
        <div>
          url:{' '}
          <input
            value={newBlog.url}
            onChange={handleChange}
            name="url"
            placeholder="url here"
          />
        </div>
        <div>
          {' '}
          <button type="submit" name="add">
            add
          </button>{' '}
        </div>
      </form>
    </div>
  )
}


export default BlogForm
