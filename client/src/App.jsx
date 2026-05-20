import { useState } from "react";
import "./App.css";
import Hamburger from "./components/hamburgerMenu";
import FreeNotes from "./emr_components/freeNotes";

function App() {
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

        <div>
          <FreeNotes/>
        </div>

      </div>
    </>
  );
}

export default App;

// Build components outside, then import them into Main Page
