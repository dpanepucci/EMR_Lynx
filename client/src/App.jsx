import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {

  return (
    <>
        <div>
          <h1>Healthcare Inc.</h1>
          <p>
          Axis Lynx - EMR
          </p>
        </div>
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
