function Container({ children }) {
  return (
    <div className="container-content">
      <div className="container-parent">{children}</div>
    </div>
  );
}

export default Container;
