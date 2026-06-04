import "./patient.css";

function Patient() {

  return (
    <>
      <div id='patient_navbar'>
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
      </div>
    </>
  );
}

export default Patient;

// Link to patient individual charts from this page
// Will show all patients assigned.
// Add vital signs to this field 
// Quick view page