import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// import DropdownMenu from "./DropdownMenu";

const StyledDropdownButton = styled.li`
  position: relative;
  display: inline-block;

  button {
    font-size: 1rem;
    padding: 1rem 2rem;
    border-color: var(--color-grey-200);
    background: none;
    border-style: none none solid none;
  }

  button:hover {
    background: var(--color-grey-200);
  }
`;

function DropdownButton({ text, className, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const itemRef = useRef();

  useEffect(() => {
    let handleOutClick = (e) => {
      if (!itemRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutClick);
  });

  return (
    <StyledDropdownButton className="dropdown" ref={itemRef}>
      <div
        type="button"
        className={className}
        onClick={() => setIsOpen(!isOpen)}
      >
        {text}
      </div>
      <ul
        className={`menu-container`}
        style={{ display: `${isOpen ? "" : "none"}` }}
      >
        {children}
      </ul>
    </StyledDropdownButton>
  );
}

export default DropdownButton;
