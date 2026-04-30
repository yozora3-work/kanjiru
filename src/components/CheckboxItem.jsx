function CheckboxItem({ id, text }) {
  return (
    <div className="checkbox-item">
      <input type="checkbox" id={id} name={id} />
      <label htmlFor={id}>{text}</label>
    </div>
  );
}

export default CheckboxItem;
