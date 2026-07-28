import "./Header.css";

function Header() {
  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <a href="/">KanjiRu</a>
        </div>
        <ul className="links">
          <li>
            <a href="/cards/learn">Learning</a>
          </li>
          <li>
            <a href="/read">Reading</a>
          </li>
          <li>
            <a href="/vocabulary">Vocabulary</a>
          </li>
        </ul>
        {/* placeholder for account info. Name and avatar */}
        <h2> </h2>
      </div>
    </header>
  );
}

export default Header;
