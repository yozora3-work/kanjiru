function Container({ children, className }) {
  return <div className={`container-content ${className}`}>{children}</div>;
}

export default Container;
