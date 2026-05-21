import { useState } from "react";
import Hamburger from "./hamburgerMenu";
import './hamburgerComponent.css'

function HamComponent() {
  const [HamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleHamburgerIcon = () => {
    setHamburgerOpen(!HamburgerOpen);
  };

  return (
    <>
      <div>
        <h1>Healthcare Inc.</h1>
      </div>
      <div id="hamburgerNav">
        <p id="Axis">Axis Lynx - EMR</p>

        <button>
          <a href='/'>Main Page</a>
        </button>
        <button>
          <a href="/patient">Patient Route</a>
        </button>

        <ul className={HamburgerOpen ? "menu open" : "menu"}>
          <li>Settings</li>
          <li>Profile</li>
          <li>
            <a href="/login">Log Out</a>
          </li>
        </ul>

        <div className="navIcon" onClick={toggleHamburgerIcon}>
          <Hamburger isOpen={HamburgerOpen} />
        </div>

      </div>
    </>
  );
}

export default HamComponent;

// Build components outside, then import them into Main Page
