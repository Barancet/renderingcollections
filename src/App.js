import "./App.css";
import { useState, useEffect } from "react";
import Note from "./components/Note";
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([]); //pass in [] if we want empty array
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  useEffect(()=> {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (event) => {
    event.preventDefault();
    const noteObj = {
      content: newNote,
      date: new Date().toISOString,
      important: Math.random() > 0.5,
    };
    noteService
      .create(noteObj)
      .then(returnedNote =>{
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
    
  };
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const deleteNote = (id) => {
    const noteId = notes.find(note => note.id === id)

    noteService
    .deleteNote(id)
    .then(() =>{
      setNotes(notes.filter(n => n.id !== id))
      console.log("note with the ID ", noteId, " was removed")
    })
    .catch(error =>{
      console.log(error)
    })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
            deleteNote={()=> deleteNote(note.id)}
            />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
