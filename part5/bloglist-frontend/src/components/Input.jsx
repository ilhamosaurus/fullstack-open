const Input = ({ value, name, setChange }) => (
  <div>
    {name}:
    <input
      type='text'
      value={value}
      name={name}
      onChange={setChange}
    />
  </div>
);

export default Input;
