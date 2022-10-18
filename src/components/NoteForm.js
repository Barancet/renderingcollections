import React from "react";
import { useState } from "react";

const NoteForm = ({createNote}) => {
  const [newNote, setNewNote] = useState('') 

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: false 
    })
    setNewNote('')
  }
  console.log("reaches this");
  return (
    <div className="formDiv">
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <div>
          <input id='note-input' value={newNote} onChange={handleChange} />
          <button id="save-btn" type="submit">
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
