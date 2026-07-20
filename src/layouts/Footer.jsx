import { useState } from "react";
import "./Footer.css";

function Footer() {
  // const [socialsOpened, setSocialsOpened] = useState(false);

  return (
    <footer>
      <div className="footer-links">
        <p className="copyright">About</p>
        {/* <p
            className="footer-link"
            onClick={() => setSocialsOpened(!socialsOpened)}
          >
            Socials
          </p> */}
      </div>
      <div className="social-icons">
        <a
          href="https://x.com/yozora391"
          className="social-icon"
          aria-label="Twitter"
        >
          X
        </a>
        <a
          href="https://t.me/Yozora3"
          className="social-icon"
          aria-label="Telegram"
        >
          TG
        </a>
        <a
          href="https://github.com/yozora3-work"
          className="social-icon"
          aria-label="GitHub"
        >
          Git
        </a>
      </div>
      <p className="copyright">&copy; 2026 Yozora</p>
    </footer>
  );
}

export default Footer;
