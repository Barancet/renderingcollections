import { useState, useEffect, useRef } from "react";
import noteService from "./services/notes";
import loginService from "./services/login";

import Note from "./components/Note";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [notes, setNotes] = useState([]); //pass in [] if we want empty array
  const [showAll, setShowAll] = useState(true);
  const [message, setMessage] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setMessage(` Note '${note.content}' was already removed from server`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote));
        setMessage(`STATUS: Note '${noteObject.content}' was added'`);
        setTimeout(() => {
          setMessage(null);
       }, 5000);
      })
  }

  const deleteNote = (id) => {
    const noteId = notes.find((note) => note.id === id);
    noteService
      .deleteNote(id)
      .then(() => {
        setNotes(notes.filter((n) => n.id !== id));
        console.log("note with the ID ", noteId, " was removed");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      noteService.setToken(user.token);
      window.localStorage.setItem("loggedNoteAppUser", JSON.stringify(user));

      setMessage(`STATUS: Welcome ${username}`);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage("Wrong credentials");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem("loggedNoteAppUser");
      setUser(null);
    } catch (exception) {
      setMessage("Couldn't log out");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={message} />

      {user === null ? (
        <Togglable buttonLabel="Sign in">
          <LoginForm
            handleSubmit={handleLogin}
            username={username}
            password={password}
            handleUsernameChange={({ target }) => {
              setUsername(target.value);
            }}
            handlePasswordChange={({ target }) => {
              setPassword(target.value);
            }}
          />
        </Togglable>
      ) : (
        <div>
          <p>
            {user.name} is logged in
            <button type="submit" onClick={handleLogout}>
              Logout
            </button>
          </p>
            {noteForm()}
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
                deleteNote={() => deleteNote(note.id)}
              />
            ))}
          </ul>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
