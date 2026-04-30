import { Link } from "react-router";

function PageNotFound() {
  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Something went wrong</h1>
    </div>
  );
}

export default PageNotFound;
