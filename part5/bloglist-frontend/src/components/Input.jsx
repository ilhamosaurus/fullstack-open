import PropTypes from 'prop-types'

const Input = ({ value, name, setChange }) => (
  <div>
    {name}:
    <input type="text" value={value} name={name} onChange={setChange} />
  </div>
)

Input.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setChange: PropTypes.func.isRequired,
}

export default Input
