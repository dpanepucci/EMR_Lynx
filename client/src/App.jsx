import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Hamburger from './components/hamburgerMenu'

function App() {

  const [HamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleHamburgerIcon = () =>{
    setHamburgerOpen(!HamburgerOpen)
  }


  return (
    <>
        <div>
          <h1>Healthcare Inc.</h1>
          <div id='hamburgerNav'>
            <p id='Axis'>Axis Lynx - EMR</p>
          <ul className={HamburgerOpen ? 'menu open' : 'menu'}>
            <li>Settings</li>
            <li>Profile</li>
            <li><a href='/login'>Log Out</a></li>
          </ul>
            <div className='navIcon' onClick={toggleHamburgerIcon}>
              <Hamburger isOpen={HamburgerOpen} />
            </div>
        </div>

        </div>
        {/* Side Patient Snap Shot */}
        <div id='pt_profile'> 
          <img
          id='proPic'
            src='./defProPic.png'
            alt='default profile picture icon'
          />
          <li>
            Name:
          </li>
          <li>
            D.O.B:
          </li>
          <li>
            Room:
          </li>
          <li>
            Dx:
          </li>
        </div>
    </>
  )
}

export default App
