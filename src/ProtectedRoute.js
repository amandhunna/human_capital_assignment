import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './authContext';
import Nav from './Components/Navbar'


function ProtectedRoute({component: Component, ...rest}) {
    const { authed } = useContext(AuthContext);

    if(authed) {
        return (
            <Route path='/home' {...rest} render={(props) => <main><Nav /><Component {...props}/></main>} />
        )
    }

    if(!authed) {
        return <Redirect to="/"/>
    }
}

export default React.memo(ProtectedRoute);
