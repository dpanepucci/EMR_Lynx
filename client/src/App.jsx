import { useState } from 'react'
import './App.css'
import FreeNotes from './emr_components/freeNotes'
import CareTeam from './emr_components/careTeamChat'

function App () {
  return (
    <>
      <div id='main_page_layout'>

        <div id='mainPageComp'>
          <FreeNotes />
          <CareTeam />
        </div>

      </div>
    </>
  )
}

export default App

// Build components outside, then import them into Main Page
