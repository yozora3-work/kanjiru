function InputLevels({ id }) {
  return (
    <input
      placeholder="1,2,3...60"
      id={id}
      name={id}
      pattern="^\d+(?:,\d+)*$"
    />
  );
}

export default InputLevels;
