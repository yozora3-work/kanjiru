import CheckboxItem from "./CheckboxItem";

function DropdownItem({ type, text, id }) {
  return (
    <li>
      {type === "checkbox" ? (
        <CheckboxItem id={id} text={text} />
      ) : (
        <p>{text}</p>
      )}
    </li>
  );
}

export default DropdownItem;
