import './freeNotes.css'
import React, { useEffect, useMemo, useState } from 'react'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('emr_user') || 'null')
  } catch {
    return null
  }
}

const getUserNotesStorageKey = () => {
  const user = getStoredUser()

  if (user?.id) {
    return `freeNotes:user:${user.id}`
  }

  if (user?.cometchat_uid) {
    return `freeNotes:user:${user.cometchat_uid}`
  }

  if (user?.username) {
    return `freeNotes:user:${user.username.toLowerCase()}`
  }

  return 'freeNotes:anonymous'
}

const readNotesFromStorage = (storageKey) => {
  const saved = localStorage.getItem(storageKey)

  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : [String(parsed)]
  } catch {
    // Migrate legacy plain-text storage to the new array format.
    return saved.trim() ? [saved] : []
  }
}

function FreeNotes () {
  const [textInput, setTextInput] = useState('')
  const notesStorageKey = useMemo(() => getUserNotesStorageKey(), [])
  const [notes, setNotes] = useState(() => readNotesFromStorage(notesStorageKey))
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    setNotes(readNotesFromStorage(notesStorageKey))
  }, [notesStorageKey])

  const handleSave = () => {
    if (!textInput.trim()) return

    const updatedNotes = [...notes, textInput]
    persistNotes(updatedNotes)

    setTextInput('')
  }

  const persistNotes = (updatedNotes) => {
    setNotes(updatedNotes)
    localStorage.setItem(notesStorageKey, JSON.stringify(updatedNotes))
  }

  const handleClearAll = () => {
    localStorage.removeItem(notesStorageKey)
    setNotes([])
    setEditingIndex(null)
    setEditingText('')
  }

  const handleDeleteNote = (indexToDelete) => {
    const updatedNotes = notes.filter((_, index) => index !== indexToDelete)
    persistNotes(updatedNotes)

    if (editingIndex === indexToDelete) {
      setEditingIndex(null)
      setEditingText('')
    }
  }

  const handleStartEdit = (indexToEdit) => {
    setEditingIndex(indexToEdit)
    setEditingText(notes[indexToEdit])
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingText('')
  }

  const handleSaveEdit = () => {
    if (editingIndex === null || !editingText.trim()) {
      return
    }

    const updatedNotes = notes.map((note, index) =>
      index === editingIndex ? editingText : note
    )
    persistNotes(updatedNotes)
    setEditingIndex(null)
    setEditingText('')
  }

  const currentTimeStamp = new Date().toLocaleDateString()

  return (
    <>
    <div id='container'>
      <h3>Free Notes</h3>
        <div>
          {notes.map((note, index) => (
            <div id='savedNotes' className='savedNoteCard' key={index}>
              <p id='notesDate'>Date: {currentTimeStamp}</p>

              {editingIndex === index ? (
                <>
                  <textarea
                    className='savedNoteEditor'
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <div className='savedNoteActions savedNoteActionsVisible'>
                    <button
                      type='button'
                      className='savedNoteActionButton'
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                    <button
                      type='button'
                      className='savedNoteActionButton savedNoteActionCancel'
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {note}
                  <div className='savedNoteActions'>
                    <button
                      type='button'
                      className='savedNoteActionButton'
                      onClick={() => handleStartEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      className='savedNoteActionButton savedNoteActionDelete'
                      onClick={() => handleDeleteNote(index)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {notes.length === 0 && <p id='noNotesSaved'>No notes saved.</p>}
        </div>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          id='freeNotes'
          placeholder='Clinical Notes'
        />
        <br />
        <button id='freeNotesSave' onClick={handleSave}>Save Notes</button>
        <button id='freeNotesClear' onClick={handleClearAll}>Clear Notes</button>
        <br />
        </div>
    </>
  )
}

export default FreeNotes
