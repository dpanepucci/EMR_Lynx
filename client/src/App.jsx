import { useState } from 'react'
import './App.css'
import Hamburger from './components/hamburgerMenu'
import FreeNotes from './emr_components/freeNotes'

function App () {
  return (
    <>
      <div id='main_page_layout'>

        <div>
          <FreeNotes />
        </div>

      </div>
    </>
  )
}

export default App

// Build components outside, then import them into Main Page
