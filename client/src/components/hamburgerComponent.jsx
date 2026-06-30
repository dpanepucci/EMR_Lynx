import { useState } from 'react'
import Hamburger from './hamburgerMenu'
import './hamburgerComponent.css'

function HamComponent () {
  const [HamburgerOpen, setHamburgerOpen] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem('emr_user') || 'null')
  const displayName = currentUser?.username || 'User'

  const toggleHamburgerIcon = () => {
    setHamburgerOpen(!HamburgerOpen)
  }

  const handleLogout = () => {
    fetch('/api/login/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(() => {})

    localStorage.removeItem('emr_user')
  }

  return (
    <>
      <div>
        <h1>Healthcare Inc.</h1>
      </div>

      <p className='loggedInUser'>Signed in: {displayName}</p>
      
      <div id='hamburgerNav'>
        <button id='mainPageBtn'>
          <a href='/'>Home</a>
        </button>
        <button id='patientPageBtn'>
          <a href='/patient'>Patients</a>
        </button>

        <ul className={HamburgerOpen ? 'menu open' : 'menu'}>
          <li>Settings</li>
          <li>Profile</li>
          <li>
            <a href='/login' onClick={handleLogout}>Log Out</a>
          </li>
        </ul>

        <div className='navAccountArea'>
          <div className='navIcon' onClick={toggleHamburgerIcon}>
            <Hamburger isOpen={HamburgerOpen} />
          </div>
        </div>

      </div>
    </>
  )
}

export default HamComponent

// Build components outside, then import them into Main Page
