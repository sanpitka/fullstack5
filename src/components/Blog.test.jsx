import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { test, vi, expect } from 'vitest'

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
