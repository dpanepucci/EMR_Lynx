import './freeNotes.css'
import React, {useState} from 'react';

function FreeNotes() {
    const [textInput, setTextInput] = useState('');

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('freeNotes');
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      // Migrate legacy plain-text storage to the new array format.
      return saved.trim() ? [saved] : [];
    }
  });

  const handleSave = () => {
    if (!textInput.trim()) return;

    const updatedNotes = [...notes, textInput];
    setNotes(updatedNotes);
    localStorage.setItem('freeNotes', JSON.stringify(updatedNotes));

    setTextInput('');
  };

  const handleClearAll = () => {
    localStorage.removeItem('freeNotes');
    setNotes([]);
  };

  const currentTimeStamp = new Date().toLocaleDateString();

    return (
        <>
        <h1>Free Notes</h1>
        <h2>Saved Notes</h2>
        <div>
            {notes.map((note, index) => (
                <div id='savedNotes' key={index}>
                    <p id='notesDate'>Date: {currentTimeStamp}</p>
                    {note}
                    </div>
            ))}

            {notes.length === 0 && <p>No notes saved.</p>}
        </div>
        <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            id ='freeNotes' 
            placeholder='Clinical Notes'/>
        <br />
        <button id='freeNotesSave' onClick={handleSave}>Save Notes</button>
        <button id='freeNotesClear' onClick={handleClearAll}>Clear Notes</button>

        </>
    )
}

export default FreeNotes;