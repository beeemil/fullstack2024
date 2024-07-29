const { test, after, beforeEach,describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)
let token

describe('Once logged in', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const initialUsers = await helper.createInitialUsers()
    await User.insertMany(initialUsers)
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    const user = {
      username:"testUser",
      password:"testsecret"
    }
    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)

    token = login.body.token
  })


  test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Fullstack Bloggy blog",
        author: "eemil",
        url: "fullstackbloggyblog.com",
        likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({"authorization": `Bearer ${token}`})
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(title.includes('Fullstack Bloggy blog'))
  })
  test('Blog without title is not added', async () => {
    const newBlog = {
        author: "eemil",
        url: "blognotitle.com",
        likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({"authorization": `Bearer ${token}`})
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('Blog without url is not added', async () => {
    const newBlog = {
        title: "NoUrlBlog",
        author: "eemil",
        likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({"authorization": `Bearer ${token}`})
      .expect(400)
    
    const response = await api.get('/api/blogs')
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  //4.11
  test('Blog without initial likes has zero likes', async () => {
    const newBlog = {
        title: "NobodyLikedThisBlog",
        author: "eemil",
        url: "blognotitle.com",
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .set({"authorization": `Bearer ${token}`})
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)
    assert.equal(likes.pop(),0)
  })
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({"authorization": `Bearer ${token}`})
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(r => r.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
  test('a blog cannot be deleted if user is not the one who added the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[4]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({"authorization": `Bearer ${token}`})
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(r => r.id)
    assert(ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  test('A blog title can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
    blogToUpdate.title = 'thisBlogWasUpdated'
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .set({"authorization": `Bearer ${token}`})
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]

    assert.strictEqual(updatedBlog.title, 'thisBlogWasUpdated')
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test("A blog's likes are updated", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
    blogToUpdate.likes = blogToUpdate.likes + 1
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .set({"authorization": `Bearer ${token}`})
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]

    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes)
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
  test('A blog title cannot be updated if the user is not the one who added the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[4]
    
    blogToUpdate.title = 'thisBlogWasUpdated'
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .set({"authorization": `Bearer ${token}`})
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[4]

    assert.notStrictEqual(updatedBlog.title, 'thisBlogWasUpdated')
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('Without being logged in', () => {
  beforeEach(async () => {
    //await User.deleteMany({})
    //const initialUsers = await helper.createInitialUsers()
    //await User.insertMany(initialUsers)
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  after(async () => {
    await mongoose.connection.close()
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are six blogs', async () => {
      const response = await api.get('/api/blogs')
    
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
    
  test('the first blog is about React patterns', async () => {
      const response = await api.get('/api/blogs')
    
      const title = response.body.map(e => e.title)
      assert(title.includes('React patterns'))
  })
  
  test('The blog has an id', async () => {
      const response = await api.get('/api/blogs')
    
      const ids = response.body.map(e => e.id)
      assert(ids.length !== 0)
  })
  test('a valid blog cannot be added if not logged in', async () => {
    const newBlog = {
        title: "Fullstack Bloggy blog",
        author: "eemil",
        url: "fullstackbloggyblog.com",
        likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      //.expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)

    assert(!title.includes('Fullstack Bloggy blog'))
  })

  test('a blog cannot be deleted if user is not logged in', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(r => r.id)
    assert(ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  test('A blog title cannot be updated if the user is not logged in', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
    blogToUpdate.title = 'thisBlogWasUpdated'
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]

    assert.notStrictEqual(updatedBlog.title, 'thisBlogWasUpdated')
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})



// 4.12

