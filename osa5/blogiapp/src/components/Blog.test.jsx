import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
const blog = {
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'test.com',
  likes: 2,
  user: {
    username:'beemil',
    name: 'eemil'
  }
}

test('renders content', () => {
  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Canonical string reduction'
  )
})

test('clicking the show-button once displays additional information', async () => {
  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Canonical string reduction'
  )
  expect(div).toHaveTextContent(
    'test.com'
  )
  expect(div).toHaveTextContent(
    '2'
  )
  expect(div).toHaveTextContent(
    'eemil'
  )
})

test('clicking the like-button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()
  const { container } = render(
    <Blog blog={blog} addLike={mockHandler}/>
  )

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})