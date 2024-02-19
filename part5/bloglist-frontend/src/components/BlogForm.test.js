import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm handleSubmit={addBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('Url')
  const createButton = screen.getByText('Create')

  await user.type(titleInput, 'create a blog')
  await user.type(authorInput, 'author')
  await user.type(urlInput, 'localhost:3003')
  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  console.log(addBlog.mock.calls[0][0])
  expect(addBlog.mock.calls[0][0].title).toBe('create a blog')
  expect(addBlog.mock.calls[0][0].author).toBe('author')
  expect(addBlog.mock.calls[0][0].url).toBe('localhost:3003')
})
