import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggelable from './Toggelable'

describe('</Toggelable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Toggelable buttonLabel="View" buttonLabel2="Hide">
        <div className="testDiv">togglable content</div>
      </Toggelable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start children are not displayed', () => {
    const div = container.querySelector('.toggelableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.toggelableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const closeButton = screen.getByText('Hide')
    await user.click(closeButton)

    const div = container.querySelector('.toggelableContent')
    expect(div).toHaveStyle('display: none')
  })
})
