import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggelable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : '',
  }
  const showWhenVisible = {
    display: visible ? '' : 'none',
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return { toggleVisibility }
  })
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="toggelableContent">
        {props.children}
        <button onClick={toggleVisibility}>{props.buttonLabel2}</button>
      </div>
    </div>
  )
})

Toggelable.displayName = 'Toggelable'

Toggelable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  buttonLabel2: PropTypes.string.isRequired,
}

export default Toggelable
