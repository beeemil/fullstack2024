import axios from 'axios'
const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createAccount = async (request, name, username, password)  => {
    await request.post('http://localhost:3001/api/users', {
        data: {
          name: name,
          username: username,
          password: password
        }
      })
  }

const addBlogWith = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'add new' }).click()
    await page.getByPlaceholder('title here').fill(title)
    await page.getByPlaceholder('author here').fill(author)
    await page.getByPlaceholder('url here').fill(url)
    await page.getByRole('button', { name: 'add' }).click()
    await page.getByText(`${title} ${author}`).waitFor()
}

const createBlogByPost = async (request, title, author, url, likes, token) => {
    const config = {
        headers: { Authorization: token,
            "Content-type":"application/json"
         },
      }
    const newBlog = {
        title: title,
        author: author,
        url: url,
        likes: likes
    }
    
    try {
        const response = await axios.post('http://localhost:3001/api/blogs', newBlog, config);
        return response.data;
      } catch (error) {
        console.error('Error creating blog:', error);
        throw error;
      }
}

  export { loginWith, addBlogWith, createAccount, createBlogByPost }