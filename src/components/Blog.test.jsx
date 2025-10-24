import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Komponentin renderöinnin alkeet',
    author: 'Erkki Esimerkki',
    url: 'http://esimerkki.vuodatus.net',
    likes: 5,
    user: {
        username: 'erkki',
        name: 'Erkki Esimerkki'
    }
  }
  render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}}/>)

  expect(screen.getByText(/Komponentin renderöinnin alkeet/)).toBeDefined()
  expect(screen.getByText(/Erkki Esimerkki/)).toBeDefined()
  expect(screen.queryByText('http://esimerkki.vuodatus.net')).toBeNull()
  expect(screen.queryByText('5 likes')).toBeNull()
})