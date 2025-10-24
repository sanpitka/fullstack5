import { render, screen } from '@testing-library/react'
import { test, vi, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Komponentin renderöinnin alkeet',
    author: 'Ajokortti Körkort',
    url: 'http://esimerkki.vuodatus.net',
    likes: 5,
    user: {
      username: 'erkki',
      name: 'Erkki Esimerkki'
    }
  }
  render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}}/>)

  expect(screen.getByText(/Komponentin renderöinnin alkeet/)).toBeDefined()
  expect(screen.getByText(/Ajokortti Körkort/)).toBeDefined()
  expect(screen.queryByText('http://esimerkki.vuodatus.net')).toBeNull()
  expect(screen.queryByText('5 likes')).toBeNull()
})

test('shows url and likes when the view button is clicked', async () => {
  const blog = {
    title: 'Komponentin renderöinnin alkeet',
    author: 'Ajokortti Körkort',
    url: 'http://esimerkki.vuodatus.net',
    likes: 5,
    user: {
      username: 'erkki',
      name: 'Erkki Esimerkki'
    }
  }
  render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}}/>)

  expect(screen.getByText(/Komponentin renderöinnin alkeet/)).toBeDefined()
  expect(screen.getByText(/Ajokortti Körkort/)).toBeDefined()
  const button = screen.getByText('view')
  await userEvent.click(button)
  expect(screen.getByText('http://esimerkki.vuodatus.net')).toBeDefined()
  expect(screen.getByText('5 likes')).toBeDefined()
  expect(screen.getByText('Erkki Esimerkki')).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Komponentin renderöinnin alkeet',
    author: 'Ajokortti Körkort',
    url: 'http://esimerkki.vuodatus.net',
    likes: 5,
    user: {
      username: 'erkki',
      name: 'Erkki Esimerkki'
    }
  }
  render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}}/>)

  const viewButton = screen.getByText('view')
  await userEvent.click(viewButton)
  const likeButton = screen.getByText('like')

  const mockHandler = vi.fn()
  likeButton.onclick = mockHandler

  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('calls addBlog with correct details when a new blog is created', async () => {
  const mockAddBlog = vi.fn()

  render(<BlogForm addBlog={mockAddBlog} />)
  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const createButton = screen.getByText('create')

  await userEvent.type(title, 'Blankki-Blogi')
  await userEvent.type(author, 'Blanko')
  await userEvent.type(url, 'http://avatutsaajuoda.blogspot.com')
  await userEvent.click(createButton)

    expect(mockAddBlog).toHaveBeenCalledTimes(1)
  expect(mockAddBlog).toHaveBeenCalledWith({
    title: 'Blankki-Blogi',
    author: 'Blanko',
    url: 'http://avatutsaajuoda.blogspot.com'
  })
})
