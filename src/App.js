// Packages
import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Loading from './Components/Loading.js'

// Protected Route for Auth
import ProtectedRoute from './ProtectedRoute.js';

// Context API
import { UserContext } from './userContext';
import { AuthContext } from './authContext';

// Page Components
import Landing from './Landing';
import Board from './Scene/Board/index.js';

// CSS Imports
import './App.css';

function App() {
  const [userId, setUserId] = useState("Default Value");
  const [ taskList, setTaskList ] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loggedIn = localStorage.getItem('rememberMe') === 'true';
      if (loggedIn){
        setUserId(localStorage.getItem('userId'));
        setAuthed(true);
      }    
      setLoading(false);
    },
    []);

    if(loading) {
      return <Loading />
    }

  
    if(!loading) {
      return (
          <AuthContext.Provider value={{authed, setAuthed}}>
            <UserContext.Provider value={{userId, setUserId, taskList, setTaskList}}>
              <BrowserRouter>
                <Switch>
                  <Route path="/" exact component={Landing}/>
                  <ProtectedRoute component={Board}/>
                </Switch>
              </BrowserRouter>
            </UserContext.Provider>
          </AuthContext.Provider>
      );
    }
}

export default App;