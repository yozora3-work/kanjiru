import styled from "styled-components";
import DropdownButton from "../components/DropdownButton";
import DropdownItem from "../ui/DropdownMenu";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 0 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-200);

  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: space-around;

  .navbar {
    margin-right: 5rem;
    width: 100%;
    display: flex;
    gap: 2.4rem;
    align-items: center;
    justify-content: space-between;
  }

  .navbar .logo a {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .navbar .links {
    display: flex;
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
            <a href="/cards/:learn">Learn</a>
          </li>
          <li>
            <a href="/read">Reading</a>
          </li>
          <li>
            <a href="/vocabulary">Vocabulary</a>
          </li>
        </ul>
        <h2>Account</h2>
      </div>
    </StyledHeader>
  );
}

export default Header;
