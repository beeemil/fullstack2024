import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)
  //onst showFormButton = screen.getByText('add new')
  //await user.click(showFormButton)
  const titleInput = screen.getByPlaceholderText('title here')
  const authorInput = screen.getByPlaceholderText('author here')
  const urlInput = screen.getByPlaceholderText('url here')
  const addButton = screen.getByText('add')

  await user.type(titleInput, 'testing a blog form title')
  await user.type(authorInput, 'Testy Tester')
  await user.type(urlInput, 'test.com')
  await user.click(addButton)
  console.log('MockCall', createBlog.mock.calls)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a blog form title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testy Tester')
  expect(createBlog.mock.calls[0][0].url).toBe('test.com')
})
