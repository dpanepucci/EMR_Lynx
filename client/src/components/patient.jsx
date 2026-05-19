import { useState } from "react";
import "./patient.css";
import Hamburger from "./hamburgerMenu.jsx";

function Patient() {
  const [HamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleHamburgerIcon = () => {
    setHamburgerOpen(!HamburgerOpen);
  };

  return (
    <>
      <div>
        <h1>Patients</h1>
      </div>
      {/* Side Patient Snap Shot */}
      <div id="pt_profile">
        <img
          id="proPic"
          src="./defProPic.png"
          alt="default profile picture icon"
        />
        <li>Name:</li>
        <li>D.O.B:</li>
        <li>Room:</li>
        <li>Dx:</li>
      </div>
    </>
  );
}

export default Patient;

// REFACTOR TO LINK TO PATIENT THAT IS SELECTED FROM THE MAIN PAGE
