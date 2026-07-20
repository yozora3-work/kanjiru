import { Link } from "react-router";
import "./PageNotFound.css";

function PageNotFound() {
  return (
    <div className="not-found-container">
      <h1>Что-то пошло не так</h1>
      <Link to="/" className="btn-home">
        Главная
      </Link>
    </div>
  );
}

export default PageNotFound;
