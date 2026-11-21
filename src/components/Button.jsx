import "./Button.css";

function Button({
  text,
  type = "button",
  className,
  onClick,
  isLoading,
  icon,
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={isLoading}
    >
      {icon && !text && <span>{icon}</span>}
      {text && !icon && <span>{text}</span>}

      {text && icon && (
        <>
          <span className="full-text-btn">{text}</span>
          <span className="short-text-btn">{icon}</span>
        </>
      )}
    </button>
  );
}

export default Button;
