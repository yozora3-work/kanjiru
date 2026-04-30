import { useState } from "react";
import "./Footer.css";

function Footer() {
  const [socialsOpened, setSocialsOpened] = useState(false);

  return (
    <>
      {socialsOpened && (
        <div>
          <p>Menu</p>
        </div>
      )}
      <footer>
        <div className="footer-links">
          <p className="footer-link">About</p>
          <p
            className="footer-link"
            onClick={() => setSocialsOpened(!socialsOpened)}
          >
            Socials
          </p>
        </div>
        <div className="social-icons">
          <a href="https://x.com/yozora391" className="social-icon">
            X
          </a>
          <a href="https://t.me/Yozora3" className="social-icon">
            tg
          </a>
          <a href="https://github.com/yozora3-work" className="social-icon">
            Git
          </a>
        </div>
        <p className="copyright">2026 Yozora</p>
      </footer>
    </>
  );
}

export default Footer;
