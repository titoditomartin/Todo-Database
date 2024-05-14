import { useState, useEffect } from "react";
import "./App.css";
import { useNavigate } from 'react-router-dom'; 
import { useUser } from './authContext/UserContext';
import axios from 'axios';

function App() {
  const navigate = useNavigate(); 
  const { userEmail } = useUser(); 
  const [todos, setTodos] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [showPopup, setShowPopup] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [filter, setFilter] = useState("All"); 
  const [error, setError] = useState(""); 
  const [displayName, setDisplayName] = useState('');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userNationality, setUserNationality] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const goToProfile = () => {
    navigate('/account');
  };

  const handleSignOut = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        const userData = response.data;
        setDisplayName(userData.DisplayName || userEmail);
        setUserAge(userData.Age || '');
        setUserNationality(userData.Nationality || '');
        setProfilePicUrl(userData.ProfilePicture || '');
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    if (userEmail) {
      fetchProfile();
    }
  }, [userEmail]);

  useEffect(() => {
    const fetchApiTodos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/todos/');
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos: ", error);
        setError("Failed to fetch todos.");
      }
    };

    fetchApiTodos();
  }, []);

  const addTodo = async () => {
    if (!newItem.trim()) return;

    const todo = {
      text: newItem,
      completed: taskStatus === "Done",
      status: taskStatus,
      user: userEmail // Add user email to the task document
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/todos/', todo);
      setTodos([...todos, response.data]);
      setNewItem("");
      setShowPopup(false);
      setTaskStatus("To Do");
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const toggleEdit = (id) => {
    setEditingId(id);
    const todo = todos.find(todo => todo.id === id);
    setEditedTitle(todo.text); 
  };

  const handleEdit = (id) => {
    const updatedTodo = { text: editedTitle, status: taskStatus, completed: todos.find(todo => todo.id === id).completed };
    updateTodo(id, updatedTodo);
    setEditingId(null);
  };

  const handleToggleTodo = (id, completed) => {
    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = { ...todo, completed };
    updateTodo(id, updatedTodo);
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  function getVisibleTodos() {
    if (filter === "In Progress") {
      return todos.filter((todo) => !todo.completed && todo.status === "In Progress");
    } else if (filter === "Done") {
      return todos.filter((todo) => todo.completed && todo.status === "Done");
    } else if (filter === "To Do") {
      return todos.filter((todo) => !todo.completed && todo.status === "To Do");
    }
    return todos;
  }

  return (
    <>
      {userEmail && (
        <div style={{ position: 'absolute', top: '10px', left: '30px' }}>
          <div className="profile-pic-container">
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="Profile" className="profile-pic" />
            ) : (
              <div className="profile-pic default-pic"></div>
            )}
          </div>
          <p>Welcome back, {displayName}</p>
          <button onClick={() => setShowProfilePopup(true)} className="label-white">Edit Profile Details</button>
          <button onClick={goToProfile} className="label-white">Go to Profile</button>
        </div>
      )}

      {showProfilePopup && (
        <div className="overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal" style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
            <form onSubmit={handleProfilePopupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="displayName" className="label-black">Display Name:</label>
              <input
                type="text"
                id="displayName"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Enter new display name"
              />
              <label htmlFor="profilePic" className="label-black">Profile Picture:</label>
              <input
                type="file"
                id="profilePic"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" className="label-white" style={{ flexGrow: 1, marginRight: '10px' }}>Save</button>
                <button type="button" className="label-white" onClick={() => setShowProfilePopup(false)} style={{ flexGrow: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="Sign-Out-Button" style={{ position: 'absolute', top: '10px', right: '20px' }}>
        <button
          className="sign-out-button"
          style={{
            boxShadow: "inset 0 2px 4px 0 rgb(2 6 23 / 0.3), inset 0 -2px 4px 0 rgb(203 213 225)",
            display: "inline-flex",
            cursor: "pointer",
            alignItems: "center",
            gap: "1rem",
            borderRadius: "0.375rem",
            border: "1px solid rgb(203 213 225)",
            background: "linear-gradient(to bottom, rgb(249 250 251), rgb(229 231 235))",
            padding: "0.5rem 1rem",
            fontWeight: "600",
            opacity: "1",
            textDecoration: "none",
            color: "rgb(55 65 81)",
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      <div className="App">
        <div className="todo-header">
          <h1 className="header">To-Do List Application</h1>
          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Done">Done</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>

        <ul className="list">
          {getVisibleTodos().map((todo) => (
            <li key={todo.id} className={`flex justify-between items-center my-2 ${todo.completed ? 'completed' : ''}`}>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => handleToggleTodo(todo.id, e.target.checked)}
                  className="check"
                />
              </div>
              <div className="task-text">
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <span className={`ml-2 ${todo.completed ? 'line-through' : ''}`}>
                    {todo.text}
                  </span>
                )}
              </div>
              <div className="button-container">
                <button
                  type="button"
                  onClick={() => toggleEdit(todo.id)}
                  className="btn-edit"
                >
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="btn-delete"
                >
                  <span>Delete</span>
                </button>
                {editingId === todo.id && (
                  <button
                    type="button"
                    onClick={() => handleEdit(todo.id)}
                    className="btn-save"
                  >
                    <span>Save</span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showPopup && (
        <div className="overlay">
          <div className="modal">
            <form onSubmit={handlePopupSubmit}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="popup-buttons">
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
                <button type="button" className="btn" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <form className="new-item-form" onSubmit={(e) => e.preventDefault()} style={{ position: 'absolute', top: '300px', left: '300px' }}>
        <div className="form-control">
          <label htmlFor="item">Enter a new task</label>
          <input
            className="input input-alt"
            placeholder="What do you need to do?"
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            style={{
              border: '2px solid #838383',
              borderRadius: '5px',
              padding: '10px',
              fontSize: '1rem',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 99, 71, 0.1)',
              color: '#333',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              width: '300px' // Increased the width
            }}
          />
          <span className="input-border input-border-alt"></span>
        </div>

        <button className="btn" type="button" onClick={() => setShowPopup(true)} style={{ marginTop: '10px' }}>
          <span>Add</span>
        </button>
      </form>
    </>
  );
}

export default App;
