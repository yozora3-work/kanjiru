import { Link } from "react-router";
import "./PageNotFound.css";

function PageNotFound() {
  return (
    <div className="not-found-container">
      <h1>Sonething went wrong</h1>
      <Link to="/" className="btn-home">
        Main
      </Link>
    </div>
  );
}

export default PageNotFound;
