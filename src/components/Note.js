import React from "react";

const Note = ({ note, toggleImportance, deleteNote }) => {

  const importantLabel = note.important ? 'Set Not important': 'Make important'
  return (
  <li className="note">
    {note.content}
    <button onClick={toggleImportance}>{importantLabel}</button>
    <button onClick={deleteNote}>Delete</button>
  </li>
    )
};

export default Note;
