const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!request.token) {
    return response.status(401).json({ error: 'missing token' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments:body.comments,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)    
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})
//4.22
blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'missing token' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === user._id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
    await user.save()
    response.status(204).end()
  } else {
    response.status(401).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const blog = {
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes,
    comments:body.comments,
    user:body.user
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).end()
  }
  const body = request.body
  const blog = {
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes,
    commetns:body.comments,
    user:body.user
  }
  console.log('id',request.params.id)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter