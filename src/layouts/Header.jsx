import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 5rem 1.2rem 5rem;
  border-bottom: 1px solid var(--color-grey-200);

  /* display: flex; */
  gap: 2.4rem;
  align-items: center;
  justify-content: space-around;

  .navbar {
    display: flex;
    gap: 2.4rem;
    align-items: center;
    justify-content: space-between;
  }

  .navbar .logo a {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
`;

function Header() {
  return (
    <StyledHeader>
      <div className="navbar">
        <div className="logo">
          <a href="/">KanjiRu</a>
        </div>
        <ul className="links">
          <li>
            <a href="/cards/learn">Изучение</a>
          </li>
          <li>
            <a href="/read">Чтение</a>
          </li>
          <li>
            <a href="/vocabulary">Словарь</a>
          </li>
        </ul>
        {/* placeholder for account info. Name and avatar */}
        <h2> </h2>
      </div>
    </StyledHeader>
  );
}

export default Header;
