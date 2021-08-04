// Packages
import React, { useState, useContext, useEffect } from 'react';

// Context API
import { UserContext } from './userContext';
import { AuthContext } from './authContext';

// CSS Imports
import './landing.css';

export default function Landing({ history }) {

    // Login Hooks
    const [loginEmail, setLoginEmail ] = useState('test@test.com');
    const [loginPass, setLoginPass ] = useState('1234');

    // Auth for UI
    const [ loginFailed, setLoginFailed ] = useState(false);

    const { setUserId } = useContext(UserContext);
    const { authed, setAuthed } = useContext(AuthContext);


    useEffect(() => {
        function checkAuth() {
            if(authed){
                history.push('/home');
            }
        }
        checkAuth();
    },[authed, history]);

    const handleLogin = (e) => {
        e.preventDefault();
        if(loginEmail === "test@test.com" && loginPass === "1234") {
            setAuthed(true);
            setUserId(1);
            localStorage.setItem('rememberMe', true);
            localStorage.setItem('userId',1)
            history.push("/home")
        } else{
            setLoginFailed(true)
        }
    }

    return (
        <div className="main-container">
            <div className="login-box">
                <h1 className="title1">Login</h1>
                <form className="login-form" action="" onSubmit={(event) => handleLogin(event)}>
                    <input type="email" value={loginEmail} placeholder="Email address" className="inputBox" onChange={event => setLoginEmail(event.target.value)}/>
                    <input type="password" value={loginPass} placeholder="Password" className="inputBox" onChange={event => setLoginPass(event.target.value)}/>
                    <button className="button" onClick={(event) => { handleLogin(event) }}>Login</button>
                </form>
                <p style={loginFailed ? {color: 'red', margin: '0', fontSize: '.7rem'} : {display: 'none'}}>Email or password incorrect</p>
                <p className="else">Hint: username: test@test.com, password: 1234</p>
            </div>
        </div>
    )
}
