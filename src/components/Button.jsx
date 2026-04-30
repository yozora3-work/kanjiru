import "./Button.css";

function Button({ text, type, className, onClick, isLoading }) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={isLoading}
    >
      {text}
    </button>
  );
}

export default Button;
