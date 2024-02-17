import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogDetail from './BlogDetail'

const blog = {
  title: 'ayo coba terus gan',
  author: 'ilhamosaurus',
  url: 'instagram.com/ilhamosaurus',
  likes: 306,
  userId: '65c9d00ecc51dedd2bd2d126',
}

let container

const likeHandler = jest.fn()
const deleteHandler = jest.fn()

beforeEach(() => {
  container = render(
    <Blog blog={blog} addLikes={likeHandler} deleteBlogs={deleteHandler} />
  ).container
})

describe('Blog component show title and author', () => {
  test('renders content', () => {
    const element = screen.getByText('ayo coba terus gan ilhamosaurus')

    screen.debug()

    expect(element).toBeDefined()
  })
})

// eslint-disable-next-line quotes
describe("Shown blog's url and likes", () => {
  test('renders url and likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.toggelableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})

describe('Event handler test', () => {
  test('clicking the button calls event handler once for two clicks', async () => {
    const user = userEvent.setup()

    container = render(
      <BlogDetail
        blog={blog}
        addLikes={likeHandler}
        deleteBlog={deleteHandler}
      />
    ).container

    const likeButton = container.querySelector('.likeButton') // Wait for button to be available

    await user.dblClick(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})
